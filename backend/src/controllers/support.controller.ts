import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    // Mock data - in production, fetch from database
    const tickets = [
      {
        id: '1',
        userId: 'user123',
        subject: 'KYC Verification Issue',
        status: 'open',
        priority: 'high',
        createdAt: new Date(),
      },
      {
        id: '2',
        userId: 'user456',
        subject: 'Withdrawal Pending',
        status: 'in_progress',
        priority: 'medium',
        createdAt: new Date(),
      },
    ];

    res.json({ tickets });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const respondToTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // In production, save response to database
    res.json({ 
      success: true, 
      message: 'Response sent successfully',
      ticketId: id,
      response: message,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getForumPosts = async (req: AuthRequest, res: Response) => {
  try {
    // Mock data - in production, fetch from database
    const posts = [
      {
        id: '1',
        title: 'Understanding Shariah-Compliant Trading',
        author: 'Admin',
        replies: 15,
        views: 230,
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'How to Calculate Zakat on Crypto Holdings',
        author: 'Scholar',
        replies: 8,
        views: 142,
        createdAt: new Date(),
      },
    ];

    res.json({ posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, type } = req.body;

    // In production, save announcement to database
    const announcement = {
      id: Date.now().toString(),
      title,
      content,
      type,
      createdBy: req.user?._id,
      createdAt: new Date(),
    };

    res.status(201).json({ 
      announcement, 
      message: 'Announcement created successfully' 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

