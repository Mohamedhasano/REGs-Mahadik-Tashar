import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import ZakatCalculation, { NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS, IZakatAsset } from '../models/Zakat.model';

/**
 * Zakat Controller - Handles Islamic Zakat calculations and records
 * 
 * Features:
 * - Calculate Zakat on assets
 * - Check Nisab threshold
 * - Track Zakat payments
 * - Generate Zakat reports
 */

// Helper: Get current gold/silver prices (mock - in production use real API)
const getCurrentMetalPrices = async (): Promise<{ gold: number; silver: number }> => {
  // Mock prices (in USD per gram)
  // In production, fetch from API like Gold API, Metals API, etc.
  return {
    gold: 65.0, // ~$65/gram
    silver: 0.85, // ~$0.85/gram
  };
};

// Helper: Calculate Nisab value in USD
const calculateNisab = (type: 'gold' | 'silver', goldPrice: number, silverPrice: number): number => {
  if (type === 'gold') {
    return NISAB_GOLD_GRAMS * goldPrice;
  } else {
    return NISAB_SILVER_GRAMS * silverPrice;
  }
};

/**
 * @route   POST /api/zakat/calculate
 * @desc    Calculate Zakat on user's assets
 * @access  Private
 */
export const calculateZakat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { assets, nisabType, hawlCompleted } = req.body;

    // Validate assets
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({ message: 'Assets are required' });
    }

    // Get current metal prices
    const { gold, silver } = await getCurrentMetalPrices();

    // Calculate total wealth
    const totalWealthUSD = assets.reduce((sum: number, asset: IZakatAsset) => {
      return sum + (asset.valueUSD || 0);
    }, 0);

    // Calculate Nisab
    const nisabValueUSD = calculateNisab(nisabType || 'silver', gold, silver);
    const meetsNisab = totalWealthUSD >= nisabValueUSD;

    // Calculate Zakat (2.5% of total wealth if Nisab is met and Hawl completed)
    const zakatRate = 0.025;
    let zakatDueUSD = 0;
    
    if (meetsNisab && hawlCompleted !== false) {
      zakatDueUSD = totalWealthUSD * zakatRate;
    }

    // Create calculation record
    const calculation = await ZakatCalculation.create({
      userId,
      calculationDate: new Date(),
      assets,
      totalWealthUSD,
      nisabType: nisabType || 'silver',
      nisabValueUSD,
      goldPricePerGram: gold,
      silverPricePerGram: silver,
      meetsNisab,
      hawlCompleted: hawlCompleted !== false,
      zakatRate,
      zakatDueUSD,
      isPaid: false,
    });

    res.json({
      message: '✅ Zakat calculated successfully',
      calculation: {
        id: calculation._id,
        totalWealthUSD,
        nisabValueUSD,
        meetsNisab,
        zakatDueUSD,
        zakatRate,
        percentageAboveNisab: meetsNisab 
          ? ((totalWealthUSD - nisabValueUSD) / nisabValueUSD * 100).toFixed(2) 
          : 0,
      },
      metalPrices: {
        gold,
        silver,
      },
      nisabInfo: {
        goldGrams: NISAB_GOLD_GRAMS,
        silverGrams: NISAB_SILVER_GRAMS,
        goldNisabUSD: NISAB_GOLD_GRAMS * gold,
        silverNisabUSD: NISAB_SILVER_GRAMS * silver,
      },
    });
  } catch (error: any) {
    console.error('Error calculating Zakat:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/zakat/history
 * @desc    Get user's Zakat calculation history
 * @access  Private
 */
export const getZakatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { limit = 10, page = 1 } = req.query;

    const calculations = await ZakatCalculation.find({ userId })
      .sort({ calculationDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await ZakatCalculation.countDocuments({ userId });

    // Calculate statistics
    const totalZakatDue = await ZakatCalculation.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId), isPaid: false } },
      { $group: { _id: null, total: { $sum: '$zakatDueUSD' } } },
    ]);

    const totalZakatPaid = await ZakatCalculation.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId), isPaid: true } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);

    res.json({
      calculations,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      statistics: {
        totalCalculations: total,
        totalZakatDue: totalZakatDue[0]?.total || 0,
        totalZakatPaid: totalZakatPaid[0]?.total || 0,
      },
    });
  } catch (error: any) {
    console.error('Error getting Zakat history:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/zakat/calculation/:id
 * @desc    Get specific Zakat calculation
 * @access  Private
 */
export const getZakatCalculation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const calculation = await ZakatCalculation.findOne({ _id: id, userId });

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.json({ calculation });
  } catch (error: any) {
    console.error('Error getting Zakat calculation:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/zakat/mark-paid/:id
 * @desc    Mark Zakat calculation as paid
 * @access  Private
 */
export const markZakatAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { paidAmount, paymentMethod, transactionHash, notes } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const calculation = await ZakatCalculation.findOne({ _id: id, userId });

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    if (calculation.isPaid) {
      return res.status(400).json({ message: 'Zakat already marked as paid' });
    }

    // Update calculation
    calculation.isPaid = true;
    calculation.paidDate = new Date();
    calculation.paidAmount = paidAmount || calculation.zakatDueUSD;
    calculation.paymentMethod = paymentMethod;
    calculation.transactionHash = transactionHash;
    calculation.notes = notes;

    await calculation.save();

    res.json({
      message: '✅ Zakat marked as paid successfully',
      calculation,
    });
  } catch (error: any) {
    console.error('Error marking Zakat as paid:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/zakat/nisab
 * @desc    Get current Nisab values
 * @access  Public (or Private)
 */
export const getNisabValues = async (req: AuthRequest, res: Response) => {
  try {
    const { gold, silver } = await getCurrentMetalPrices();

    const goldNisabUSD = NISAB_GOLD_GRAMS * gold;
    const silverNisabUSD = NISAB_SILVER_GRAMS * silver;

    res.json({
      metalPrices: {
        gold: {
          pricePerGram: gold,
          currency: 'USD',
        },
        silver: {
          pricePerGram: silver,
          currency: 'USD',
        },
      },
      nisab: {
        gold: {
          grams: NISAB_GOLD_GRAMS,
          valueUSD: goldNisabUSD,
        },
        silver: {
          grams: NISAB_SILVER_GRAMS,
          valueUSD: silverNisabUSD,
        },
      },
      zakatRate: '2.5%',
      recommendation: 'Silver Nisab is recommended as it benefits more people in need',
    });
  } catch (error: any) {
    console.error('Error getting Nisab values:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/zakat/calculation/:id
 * @desc    Delete Zakat calculation
 * @access  Private
 */
export const deleteZakatCalculation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const calculation = await ZakatCalculation.findOneAndDelete({ _id: id, userId });

    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.json({
      message: '✅ Calculation deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting Zakat calculation:', error);
    res.status(500).json({ message: error.message });
  }
};

