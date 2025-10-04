import mongoose, { Document, Schema } from 'mongoose';

export type ProjectStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'launched';

export interface IProject extends Document {
  name: string;
  symbol: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  status: ProjectStatus;
  website?: string;
  whitepaper?: string;
  businessModel: string;
  tokenomics?: any;
  roadmap?: any;
  team?: any[];
  submittedDocuments: string[];
  shariahReviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  launchDate?: Date;
  targetRaise?: number;
  currentRaise?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'launched'],
      default: 'draft',
    },
    website: String,
    whitepaper: String,
    businessModel: {
      type: String,
      required: true,
    },
    tokenomics: Schema.Types.Mixed,
    roadmap: Schema.Types.Mixed,
    team: [Schema.Types.Mixed],
    submittedDocuments: [String],
    shariahReviewNotes: String,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    launchDate: Date,
    targetRaise: Number,
    currentRaise: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);

