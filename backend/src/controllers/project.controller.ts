import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Project from '../models/Project.model';

export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Project.find({ ownerId: req.user?._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.create({
      ...req.body,
      ownerId: req.user?._id,
    });

    res.status(201).json({ project, message: 'Project created successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, ownerId: req.user?._id });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    if (project.status !== 'draft') {
      return res.status(400).json({ message: 'Cannot edit submitted project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ project: updatedProject, message: 'Project updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, ownerId: req.user?._id });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    if (project.status !== 'draft') {
      return res.status(400).json({ message: 'Project already submitted' });
    }

    project.status = 'submitted';
    await project.save();

    res.json({ project, message: 'Project submitted for Shariah review' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate('ownerId', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

