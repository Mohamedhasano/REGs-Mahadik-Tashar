import mongoose, { Document, Schema } from 'mongoose';

/**
 * Zakat Model - Islamic Wealth Tax Calculator
 * 
 * Zakat is 2.5% of qualifying wealth held for a lunar year (Hawl)
 * Nisab (minimum threshold) is based on gold/silver prices
 */

export interface IZakatAsset {
  type: 'crypto' | 'cash' | 'gold' | 'silver' | 'stocks' | 'other';
  name: string; // e.g., "Bitcoin", "USD Cash"
  amount: number; // Quantity
  valueUSD: number; // Value in USD
  acquiredDate?: Date; // When acquired (for Hawl calculation)
}

export interface IZakatCalculation extends Document {
  userId: mongoose.Types.ObjectId;
  calculationDate: Date;
  
  // Assets
  assets: IZakatAsset[];
  totalWealthUSD: number; // Sum of all assets
  
  // Nisab (Minimum Threshold)
  nisabType: 'gold' | 'silver'; // Based on gold or silver
  nisabValueUSD: number; // Current Nisab value in USD
  goldPricePerGram: number; // Current gold price ($/gram)
  silverPricePerGram: number; // Current silver price ($/gram)
  meetsNisab: boolean; // Whether wealth meets Nisab
  
  // Hawl (Lunar Year)
  hawlCompleted: boolean; // Whether lunar year has passed
  hawlStartDate?: Date; // When Hawl started
  
  // Zakat Calculation
  zakatRate: number; // Usually 2.5% (0.025)
  zakatDueUSD: number; // Zakat amount due
  
  // Payment
  isPaid: boolean;
  paidDate?: Date;
  paidAmount?: number;
  paymentMethod?: string; // 'crypto' | 'cash' | 'bank_transfer'
  transactionHash?: string; // For crypto payments
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ZakatAssetSchema = new Schema({
  type: {
    type: String,
    enum: ['crypto', 'cash', 'gold', 'silver', 'stocks', 'other'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  valueUSD: {
    type: Number,
    required: true,
    min: 0,
  },
  acquiredDate: {
    type: Date,
  },
}, { _id: false });

const ZakatCalculationSchema = new Schema<IZakatCalculation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    calculationDate: {
      type: Date,
      default: Date.now,
    },
    assets: {
      type: [ZakatAssetSchema],
      required: true,
    },
    totalWealthUSD: {
      type: Number,
      required: true,
      min: 0,
    },
    nisabType: {
      type: String,
      enum: ['gold', 'silver'],
      default: 'silver', // Silver Nisab is more accessible
    },
    nisabValueUSD: {
      type: Number,
      required: true,
    },
    goldPricePerGram: {
      type: Number,
      required: true,
    },
    silverPricePerGram: {
      type: Number,
      required: true,
    },
    meetsNisab: {
      type: Boolean,
      required: true,
    },
    hawlCompleted: {
      type: Boolean,
      default: true, // Assume Hawl completed unless specified
    },
    hawlStartDate: {
      type: Date,
    },
    zakatRate: {
      type: Number,
      default: 0.025, // 2.5%
    },
    zakatDueUSD: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
    },
    paidAmount: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ['crypto', 'cash', 'bank_transfer', 'other'],
    },
    transactionHash: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ZakatCalculationSchema.index({ userId: 1, calculationDate: -1 });
ZakatCalculationSchema.index({ userId: 1, isPaid: 1 });

// Constants for Nisab calculation (in grams)
export const NISAB_GOLD_GRAMS = 85; // 85 grams of gold
export const NISAB_SILVER_GRAMS = 595; // 595 grams of silver

export default mongoose.model<IZakatCalculation>('ZakatCalculation', ZakatCalculationSchema);

