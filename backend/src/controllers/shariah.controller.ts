import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Asset from '../models/Asset.model';
import Project from '../models/Project.model';

export const getPendingAssets = async (req: AuthRequest, res: Response) => {
  try {
    const assets = await Asset.find({
      complianceStatus: { $in: ['pending', 'under_review'] },
    }).sort({ createdAt: -1 });

    const projects = await Project.find({
      status: { $in: ['submitted', 'under_review'] },
    })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ assets, projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { complianceStatus, complianceNotes } = req.body;

    const asset = await Asset.findByIdAndUpdate(
      id,
      {
        complianceStatus,
        complianceNotes,
        shariahApprovedBy: req.user?._id,
        shariahApprovedAt: new Date(),
      },
      { new: true }
    );

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ asset, message: 'Asset reviewed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const issueFatwa = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fatwa } = req.body;

    const asset = await Asset.findByIdAndUpdate(
      id,
      { fatwa },
      { new: true }
    );

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ asset, message: 'Fatwa issued successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplianceReports = async (req: AuthRequest, res: Response) => {
  try {
    const approvedAssets = await Asset.countDocuments({ complianceStatus: 'approved' });
    const rejectedAssets = await Asset.countDocuments({ complianceStatus: 'rejected' });
    const pendingAssets = await Asset.countDocuments({ complianceStatus: 'pending' });
    
    const approvedProjects = await Project.countDocuments({ status: 'approved' });
    const rejectedProjects = await Project.countDocuments({ status: 'rejected' });
    const pendingProjects = await Project.countDocuments({ status: 'submitted' });

    res.json({
      assets: { approved: approvedAssets, rejected: rejectedAssets, pending: pendingAssets },
      projects: { approved: approvedProjects, rejected: rejectedProjects, pending: pendingProjects },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

