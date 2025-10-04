import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction.model';
import Asset from '../models/Asset.model';

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    // Get user's completed transactions
    const transactions = await Transaction.find({
      userId: req.user?._id,
      status: 'completed',
    });

    // Calculate portfolio balances
    const portfolio: any = {};
    
    transactions.forEach(tx => {
      if (!portfolio[tx.asset]) {
        portfolio[tx.asset] = { balance: 0, totalInvested: 0 };
      }
      
      if (tx.type === 'buy' || tx.type === 'deposit' || tx.type === 'stake') {
        portfolio[tx.asset].balance += tx.amount;
        portfolio[tx.asset].totalInvested += tx.totalValue;
      } else if (tx.type === 'sell' || tx.type === 'withdrawal' || tx.type === 'unstake') {
        portfolio[tx.asset].balance -= tx.amount;
      }
    });

    res.json({ portfolio });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ transactions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { type, asset, amount, price } = req.body;

    // Check if asset is Shariah-compliant
    const assetDoc = await Asset.findOne({ symbol: asset });
    if (!assetDoc || assetDoc.complianceStatus !== 'approved') {
      return res.status(400).json({ message: 'Asset is not Shariah-compliant' });
    }

    const totalValue = amount * price;
    const fee = totalValue * 0.001; // 0.1% fee

    const transaction = await Transaction.create({
      userId: req.user?._id,
      type,
      asset,
      amount,
      price,
      totalValue,
      fee,
      status: 'completed', // In production, this would be 'pending'
    });

    res.status(201).json({ transaction });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const calculateZakat = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user?._id,
      status: 'completed',
    });

    let totalValue = 0;
    transactions.forEach(tx => {
      if (tx.type === 'buy' || tx.type === 'deposit') {
        totalValue += tx.totalValue;
      } else if (tx.type === 'sell' || tx.type === 'withdrawal') {
        totalValue -= tx.totalValue;
      }
    });

    // Zakat is 2.5% of total wealth held for one lunar year
    const zakatAmount = totalValue * 0.025;
    const nisab = 85 * 60; // Approximate value of 85 grams of gold in USD

    res.json({
      totalWealth: totalValue,
      zakatAmount: totalValue >= nisab ? zakatAmount : 0,
      nisabThreshold: nisab,
      isZakatDue: totalValue >= nisab,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStakingPools = async (req: AuthRequest, res: Response) => {
  try {
    // Mock staking pools - in production, fetch from database
    const pools = [
      {
        id: '1',
        asset: 'BTC',
        apy: 5.5,
        minStake: 0.001,
        lockPeriod: 30,
        isShariahCompliant: true,
      },
      {
        id: '2',
        asset: 'ETH',
        apy: 7.2,
        minStake: 0.01,
        lockPeriod: 60,
        isShariahCompliant: true,
      },
    ];

    res.json({ pools });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const stakeAssets = async (req: AuthRequest, res: Response) => {
  try {
    const { asset, amount, poolId } = req.body;

    const transaction = await Transaction.create({
      userId: req.user?._id,
      type: 'stake',
      asset,
      amount,
      totalValue: amount,
      fee: 0,
      status: 'completed',
      notes: `Staked in pool ${poolId}`,
    });

    res.status(201).json({ transaction, message: 'Assets staked successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

