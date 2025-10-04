import mongoose, { Document, Schema } from 'mongoose';

export type ComplianceStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface IAsset extends Document {
  symbol: string;
  name: string;
  type: 'crypto' | 'commodity' | 'token';
  complianceStatus: ComplianceStatus;
  shariahApprovedBy?: mongoose.Types.ObjectId;
  shariahApprovedAt?: Date;
  fatwa?: string;
  complianceNotes?: string;
  marketCap?: number;
  price?: number;
  volume24h?: number;
  isActive: boolean;
  icon?: string;
  description?: string;
  website?: string;
  whitepaper?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['crypto', 'commodity', 'token'],
      default: 'crypto',
    },
    complianceStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'under_review'],
      default: 'pending',
    },
    shariahApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    shariahApprovedAt: Date,
    fatwa: String,
    complianceNotes: String,
    marketCap: Number,
    price: Number,
    volume24h: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: String,
    description: String,
    website: String,
    whitepaper: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAsset>('Asset', AssetSchema);

