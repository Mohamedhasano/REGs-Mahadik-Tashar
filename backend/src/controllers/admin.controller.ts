import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User.model';
import Asset from '../models/Asset.model';
import Transaction from '../models/Transaction.model';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users, total: users.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { kycStatus, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { kycStatus, isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, message: 'User status updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAssets = async (req: AuthRequest, res: Response) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json({ assets, total: assets.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json({ asset, message: 'Asset created successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByIdAndUpdate(id, req.body, { new: true });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ asset, message: 'Asset updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 100, status } = req.query;
    
    const query: any = {};
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ transactions, total: transactions.length });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAssets = await Asset.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const pendingKYC = await User.countDocuments({ kycStatus: 'pending' });

    const recentTransactions = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalVolume: { $sum: '$totalValue' } } },
    ]);

    const totalVolume = recentTransactions[0]?.totalVolume || 0;

    res.json({
      stats: {
        totalUsers,
        totalAssets,
        totalTransactions,
        pendingKYC,
        totalVolume,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

