/**
 * Payment Service - Сервис для работы с платежами
 */

import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { BitcapitalModalComponent } from '@/components/modals/bitcapital-modal';
import { ILogger } from '@/core/interfaces/logger.interface';
import { logger } from '@/core/logger';
import { 
  PaymentMethod, 
  PaymentResult, 
  Transaction, 
  DepositData, 
  WithdrawalData,
  PaymentFormData,
  PaymentValidation,
  PaymentHistory,
  BalanceInfo,
  PaymentLimits,
  PaymentError
} from '@/types/payment.types';

export class PaymentService extends BaseService {
  private readonly bitcapitalModal: BitcapitalModalComponent;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'PaymentService', loggerInstance || logger);
    this.bitcapitalModal = new BitcapitalModalComponent(page, loggerInstance);
  }

  // ============ ПОЛУЧЕНИЕ ИНФОРМАЦИИ О БАЛАНСЕ ============
  
  async getBalance(): Promise<BalanceInfo> {
    this.logStep('Getting user balance information');
    
    try {
      const mainBalance = await this.page.locator('[data-testid="main-balance"]').textContent() || '0';
      const bonusBalance = await this.page.locator('[data-testid="bonus-balance"]').textContent() || '0';
      const currency = await this.page.locator('[data-testid="currency"]').textContent() || 'USD';
      
      const main = parseFloat(mainBalance.replace(/[^\d.]/g, ''));
      const bonus = parseFloat(bonusBalance.replace(/[^\d.]/g, ''));
      const total = main + bonus;
      
      const balanceInfo: BalanceInfo = {
        main,
        bonus,
        currency,
        total,
        isFrozen: await this.isBalanceFrozen(),
        lastUpdated: new Date()
      };
      
      this.logSuccess(`Balance retrieved: ${total} ${currency}`);
      return balanceInfo;
    } catch (error) {
      this.logError(`Failed to get balance: ${error}`);
      return {
        main: 0,
        bonus: 0,
        currency: 'USD',
        total: 0,
        isFrozen: false,
        lastUpdated: new Date()
      };
    }
  }

  async isBalanceFrozen(): Promise<boolean> {
    try {
      return await this.page.locator('[data-testid="balance-frozen"]').isVisible();
    } catch {
      return false;
    }
  }

  // ============ ПОПОЛНЕНИЕ СЧЕТА ============
  
  async deposit(amount: number, method: string, additionalData?: Partial<DepositData>): Promise<PaymentResult> {
    this.logStep(`Processing deposit: ${amount} ${method}`);
    
    try {
      await this.bitcapitalModal.openDepositModal();
      await this.bitcapitalModal.enterAmount(amount.toString());
      
      // Выбор метода платежа
      if (method) {
        await this.selectPaymentMethod(method);
      }
      
      // Заполнение дополнительных данных
      if (additionalData) {
        await this.fillPaymentForm(additionalData);
      }
      
      // Подтверждение депозита
      await this.bitcapitalModal.confirmDeposit();
      
      // Ожидание результата
      const result = await this.waitForPaymentResult();
      
      this.logSuccess(`Deposit processed: ${result.transactionId}`);
      return result;
    } catch (error) {
      this.logError(`Failed to process deposit: ${error}`);
      return {
        success: false,
        transactionId: '',
        amount,
        currency: 'USD',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async withdraw(amount: number, method: string, additionalData?: Partial<WithdrawalData>): Promise<PaymentResult> {
    this.logStep(`Processing withdrawal: ${amount} ${method}`);
    
    try {
      await this.bitcapitalModal.openWithdrawModal();
      await this.bitcapitalModal.enterAmount(amount.toString());
      
      // Выбор метода вывода
      if (method) {
        await this.selectPaymentMethod(method);
      }
      
      // Заполнение дополнительных данных
      if (additionalData) {
        await this.fillWithdrawalForm(additionalData);
      }
      
      // Подтверждение вывода
      await this.bitcapitalModal.confirmWithdraw();
      
      // Ожидание результата
      const result = await this.waitForPaymentResult();
      
      this.logSuccess(`Withdrawal processed: ${result.transactionId}`);
      return result;
    } catch (error) {
      this.logError(`Failed to process withdrawal: ${error}`);
      return {
        success: false,
        transactionId: '',
        amount,
        currency: 'USD',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ============ ПОЛУЧЕНИЕ МЕТОДОВ ПЛАТЕЖЕЙ ============
  
  async getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
    this.logStep('Getting available payment methods');
    
    try {
      const methodElements = await this.page.locator('.payment-method').all();
      const methods: PaymentMethod[] = [];
      
      for (const element of methodElements) {
        const method = await this.extractPaymentMethod(element);
        methods.push(method);
      }
      
      this.logSuccess(`Found ${methods.length} payment methods`);
      return methods;
    } catch (error) {
      this.logError(`Failed to get payment methods: ${error}`);
      return [];
    }
  }

  async getDepositMethods(): Promise<PaymentMethod[]> {
    const allMethods = await this.getAvailablePaymentMethods();
    return allMethods.filter(m => m.type !== 'withdrawal');
  }

  async getWithdrawalMethods(): Promise<PaymentMethod[]> {
    const allMethods = await this.getAvailablePaymentMethods();
    return allMethods.filter(m => m.type !== 'deposit');
  }

  // ============ ИСТОРИЯ ТРАНЗАКЦИЙ ============
  
  async getTransactionHistory(page: number = 1, limit: number = 10): Promise<PaymentHistory> {
    this.logStep(`Getting transaction history: page ${page}, limit ${limit}`);
    
    try {
      // Навигация к странице истории
      await this.page.goto('/transactions');
      await this.page.waitForLoadState('domcontentloaded');
      
      // Получение транзакций
      const transactionElements = await this.page.locator('.transaction-item').all();
      const transactions: Transaction[] = [];
      
      for (const element of transactionElements) {
        const transaction = await this.extractTransaction(element);
        transactions.push(transaction);
      }
      
      const history: PaymentHistory = {
        transactions,
        total: transactions.length,
        page,
        limit,
        hasNext: await this.page.locator('[data-testid="next-page"]').isVisible(),
        hasPrev: await this.page.locator('[data-testid="prev-page"]').isVisible()
      };
      
      this.logSuccess(`Retrieved ${transactions.length} transactions`);
      return history;
    } catch (error) {
      this.logError(`Failed to get transaction history: ${error}`);
      return {
        transactions: [],
        total: 0,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false
      };
    }
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    this.logStep(`Getting transaction by ID: ${transactionId}`);
    
    try {
      const transactionElement = this.page.locator(`[data-transaction-id="${transactionId}"]`);
      
      if (await transactionElement.isVisible()) {
        const transaction = await this.extractTransaction(transactionElement);
        this.logSuccess(`Transaction found: ${transactionId}`);
        return transaction;
      }
      
      this.logError(`Transaction not found: ${transactionId}`);
      return null;
    } catch (error) {
      this.logError(`Failed to get transaction: ${error}`);
      return null;
    }
  }

  // ============ ЛИМИТЫ ПЛАТЕЖЕЙ ============
  
  async getPaymentLimits(): Promise<PaymentLimits> {
    this.logStep('Getting payment limits');
    
    try {
      const minDeposit = await this.page.locator('[data-testid="min-deposit"]').textContent() || '0';
      const maxDeposit = await this.page.locator('[data-testid="max-deposit"]').textContent() || '0';
      const minWithdrawal = await this.page.locator('[data-testid="min-withdrawal"]').textContent() || '0';
      const maxWithdrawal = await this.page.locator('[data-testid="max-withdrawal"]').textContent() || '0';
      const dailyLimit = await this.page.locator('[data-testid="daily-limit"]').textContent() || '0';
      const monthlyLimit = await this.page.locator('[data-testid="monthly-limit"]').textContent() || '0';
      const currency = await this.page.locator('[data-testid="currency"]').textContent() || 'USD';
      
      const limits: PaymentLimits = {
        minDeposit: parseFloat(minDeposit.replace(/[^\d.]/g, '')),
        maxDeposit: parseFloat(maxDeposit.replace(/[^\d.]/g, '')),
        minWithdrawal: parseFloat(minWithdrawal.replace(/[^\d.]/g, '')),
        maxWithdrawal: parseFloat(maxWithdrawal.replace(/[^\d.]/g, '')),
        dailyLimit: parseFloat(dailyLimit.replace(/[^\d.]/g, '')),
        monthlyLimit: parseFloat(monthlyLimit.replace(/[^\d.]/g, '')),
        currency
      };
      
      this.logSuccess('Payment limits retrieved');
      return limits;
    } catch (error) {
      this.logError(`Failed to get payment limits: ${error}`);
      return {
        minDeposit: 0,
        maxDeposit: 0,
        minWithdrawal: 0,
        maxWithdrawal: 0,
        dailyLimit: 0,
        monthlyLimit: 0,
        currency: 'USD'
      };
    }
  }

  // ============ ВАЛИДАЦИЯ ПЛАТЕЖЕЙ ============
  
  async validatePaymentForm(formData: PaymentFormData): Promise<PaymentValidation> {
    this.logStep('Validating payment form');
    
    try {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Валидация суммы
      if (formData.amount <= 0) {
        errors.push('Amount must be greater than 0');
      }
      
      // Валидация метода
      if (!formData.method) {
        errors.push('Payment method is required');
      }
      
      // Валидация валюты
      if (!formData.currency) {
        errors.push('Currency is required');
      }
      
      // Получение лимитов для дополнительной валидации
      const limits = await this.getPaymentLimits();
      
      if (formData.amount < limits.minDeposit) {
        errors.push(`Amount must be at least ${limits.minDeposit} ${limits.currency}`);
      }
      
      if (formData.amount > limits.maxDeposit) {
        errors.push(`Amount must not exceed ${limits.maxDeposit} ${limits.currency}`);
      }
      
      const validation: PaymentValidation = {
        isValid: errors.length === 0,
        errors,
        warnings
      };
      
      this.logStep(`Payment validation result: ${validation.isValid ? 'valid' : 'invalid'}`);
      return validation;
    } catch (error) {
      this.logError(`Failed to validate payment form: ${error}`);
      return {
        isValid: false,
        errors: ['Validation failed'],
        warnings: []
      };
    }
  }

  // ============ ПРИВАТНЫЕ МЕТОДЫ ============
  
  private async selectPaymentMethod(method: string): Promise<void> {
    this.logStep(`Selecting payment method: ${method}`);
    await this.page.locator(`[data-payment-method="${method}"]`).click();
  }

  private async fillPaymentForm(data: Partial<DepositData>): Promise<void> {
    this.logStep('Filling payment form');
    
    if (data.cardNumber) {
      await this.page.locator('#card-number').fill(data.cardNumber);
    }
    
    if (data.expiryDate) {
      await this.page.locator('#expiry-date').fill(data.expiryDate);
    }
    
    if (data.cvv) {
      await this.page.locator('#cvv').fill(data.cvv);
    }
    
    if (data.cardholderName) {
      await this.page.locator('#cardholder-name').fill(data.cardholderName);
    }
    
    if (data.walletAddress) {
      await this.page.locator('#wallet-address').fill(data.walletAddress);
    }
  }

  private async fillWithdrawalForm(data: Partial<WithdrawalData>): Promise<void> {
    this.logStep('Filling withdrawal form');
    
    if (data.bankAccount) {
      await this.page.locator('#bank-account').fill(data.bankAccount);
    }
    
    if (data.walletAddress) {
      await this.page.locator('#wallet-address').fill(data.walletAddress);
    }
    
    if (data.cardNumber) {
      await this.page.locator('#card-number').fill(data.cardNumber);
    }
    
    if (data.swiftCode) {
      await this.page.locator('#swift-code').fill(data.swiftCode);
    }
    
    if (data.iban) {
      await this.page.locator('#iban').fill(data.iban);
    }
  }

  private async waitForPaymentResult(): Promise<PaymentResult> {
    this.logStep('Waiting for payment result');
    
    try {
      // Ожидание появления результата
      await this.page.waitForSelector('.payment-result', { timeout: 30000 });
      
      const success = await this.page.locator('.payment-success').isVisible();
      const transactionId = await this.page.locator('[data-testid="transaction-id"]').textContent() || '';
      const amount = await this.page.locator('[data-testid="amount"]').textContent() || '0';
      const currency = await this.page.locator('[data-testid="currency"]').textContent() || 'USD';
      const message = await this.page.locator('[data-testid="message"]').textContent() || '';
      
      const result: PaymentResult = {
        success,
        transactionId,
        amount: parseFloat(amount.replace(/[^\d.]/g, '')),
        currency,
        status: success ? 'completed' : 'failed',
        message
      };
      
      this.logSuccess(`Payment result: ${result.status}`);
      return result;
    } catch (error) {
      this.logError(`Failed to get payment result: ${error}`);
      return {
        success: false,
        transactionId: '',
        amount: 0,
        currency: 'USD',
        status: 'failed',
        message: 'Payment result timeout'
      };
    }
  }

  private async extractPaymentMethod(element: any): Promise<PaymentMethod> {
    const id = await element.getAttribute('data-method-id') || '';
    const name = await element.locator('.method-name').textContent() || '';
    const type = await element.getAttribute('data-method-type') as 'card' | 'wallet' | 'crypto' | 'bank' | 'mobile' || 'card';
    const isAvailable = !(await element.hasClass('disabled'));
    const minAmount = parseFloat(await element.getAttribute('data-min-amount') || '0');
    const maxAmount = parseFloat(await element.getAttribute('data-max-amount') || '0');
    const fee = parseFloat(await element.getAttribute('data-fee') || '0');
    const currency = await element.getAttribute('data-currency') || 'USD';
    const icon = await element.locator('.method-icon img').getAttribute('src') || '';
    const description = await element.locator('.method-description').textContent() || '';
    
    return {
      id,
      name,
      type,
      isAvailable,
      minAmount,
      maxAmount,
      fee,
      currency,
      icon,
      description
    };
  }

  private async extractTransaction(element: any): Promise<Transaction> {
    const id = await element.getAttribute('data-transaction-id') || '';
    const type = await element.getAttribute('data-transaction-type') as 'deposit' | 'withdrawal' | 'bonus' | 'win' | 'bet' | 'refund' || 'deposit';
    const amount = parseFloat(await element.locator('.amount').textContent()?.replace(/[^\d.]/g, '') || '0');
    const currency = await element.locator('.currency').textContent() || 'USD';
    const status = await element.getAttribute('data-status') as 'pending' | 'completed' | 'failed' | 'cancelled' || 'pending';
    const date = new Date(await element.locator('.date').textContent() || '');
    const description = await element.locator('.description').textContent() || '';
    const method = await element.locator('.method').textContent() || '';
    const reference = await element.getAttribute('data-reference') || '';
    const fee = parseFloat(await element.locator('.fee').textContent()?.replace(/[^\d.]/g, '') || '0');
    
    return {
      id,
      type,
      amount,
      currency,
      status,
      date,
      description,
      method,
      reference,
      fee
    };
  }
}
