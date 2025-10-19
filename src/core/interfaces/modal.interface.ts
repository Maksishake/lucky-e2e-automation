/**
 * Modal Interfaces - Интерфейсы для модальных окон
 */

import { Locator } from '@playwright/test';

export interface IModal {
  open(): Promise<void>;
  close(): Promise<void>;
  isOpen(): Promise<boolean>;
  waitForOpen(): Promise<void>;
  waitForClose(): Promise<void>;
  getTitle(): Promise<string>;
  getContent(): Promise<string>;
}

export interface IAuthModal extends IModal {
  loginWithEmail(email: string, password: string): Promise<void>;
  loginWithPhone(phone: string, password: string): Promise<void>;
  openLoginModal(): Promise<void>;
  openRegistrationModal(): Promise<void>;
}

export interface IRegistrationModal extends IModal {
  registerWithEmail(email: string, phone: string, password: string, confirmPassword: string): Promise<void>;
  openRegistrationModal(): Promise<void>;
}

export interface IPaymentModal extends IModal {
  openDepositModal(): Promise<void>;
  openWithdrawModal(): Promise<void>;
  enterAmount(amount: string): Promise<void>;
  confirmDeposit(): Promise<void>;
  confirmWithdraw(): Promise<void>;
}

export interface ITournamentModal extends IModal {
  openTournamentDetails(tournamentId: string): Promise<void>;
  participateInTournament(): Promise<void>;
  cancelParticipation(): Promise<void>;
  getTournamentInfo(): Promise<{
    title: string;
    description: string;
    prizeFund: string;
    rules: string;
    participationInfo: string;
  }>;
  getTimerInfo(): Promise<{
    timeRemaining: string;
    isActive: boolean;
  }>;
  getPrizesTable(): Promise<Array<{
    position: string;
    prize: string;
  }>>;
}

export interface IModalSelectors {
  modalContainer: Locator;
  modalContent: Locator;
  modalHeader: Locator;
  modalTitle: Locator;
  modalBody: Locator;
  modalFooter: Locator;
  closeButton: Locator;
  backdrop: Locator;
}
