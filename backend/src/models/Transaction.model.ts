import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdrawal' | 'stake' | 'unstake' | 'zakat' | 'sadaqah';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  asset: string;
  amount: number;
  price?: number;
  totalValue: number;
  fee: number;
  status: TransactionStatus;
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
  network?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['buy', 'sell', 'deposit', 'withdrawal', 'stake', 'unstake', 'zakat', 'sadaqah'],
      required: true,
    },
    asset: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: Number,
    totalValue: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    txHash: String,
    fromAddress: String,
    toAddress: String,
    network: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);

