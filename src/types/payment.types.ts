/**
 * Payment Types - Типы для платежей и транзакций
 */

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'crypto' | 'bank' | 'mobile';
  isAvailable: boolean;
  minAmount: number;
  maxAmount: number;
  fee: number;
  currency: string;
  icon?: string;
  description?: string;
};

export type PaymentResult = {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  redirectUrl?: string;
  expiresAt?: Date;
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'win' | 'bet' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: Date;
  description: string;
  method: string;
  reference?: string;
  fee?: number;
};

export type DepositData = {
  amount: number;
  currency: string;
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  walletAddress?: string;
  bankAccount?: string;
};

export type WithdrawalData = {
  amount: number;
  currency: string;
  method: string;
  bankAccount?: string;
  walletAddress?: string;
  cardNumber?: string;
  swiftCode?: string;
  iban?: string;
};

export type PaymentFormData = {
  amount: number;
  currency: string;
  method: string;
  [key: string]: unknown;
};

export type PaymentValidation = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

export type PaymentHistory = {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type BalanceInfo = {
  main: number;
  bonus: number;
  currency: string;
  total: number;
  isFrozen: boolean;
  lastUpdated: Date;
};

export type PaymentLimits = {
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
};

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type PaymentError = {
  code: string;
  message: string;
  field?: string;
  details?: unknown;
};
