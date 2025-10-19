/**
 * Tournament Service - Сервис для работы с турнирами
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';
import { TournamentPage } from '../../components/pages/tournament.page';
import { TournamentModalComponent } from '../../components/modals/tournament-modal';
import { TournamentInfo, TournamentPageStats, TournamentFilters, TournamentSearchResult } from '../../types/tournament.types';

export class TournamentService extends BaseService {
  private tournamentPage: TournamentPage;
  private tournamentModal: TournamentModalComponent;

  constructor(page: Page) {
    super(page, 'TournamentService');
    
    this.tournamentPage = new TournamentPage(page);
    this.tournamentModal = new TournamentModalComponent(page);
  }

  /**
   * Перейти на страницу турниров
   */
  async navigateToTournaments(): Promise<void> {
    this.logStep('Navigating to tournaments page');
    
    try {
      await this.tournamentPage.navigate();
      await this.tournamentPage.waitForPageLoad();
      this.logSuccess('Navigated to tournaments page');
    } catch (error) {
      this.logError(`Failed to navigate to tournaments page: ${error}`);
      throw error;
    }
  }

  /**
   * Получить все турниры на странице
   */
  async getAllTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting all tournaments');
    
    try {
      const tournaments = await this.tournamentPage.getAllTournamentsInfo();
      this.logSuccess(`Retrieved ${tournaments.length} tournaments`);
      return tournaments;
    } catch (error) {
      this.logError(`Failed to get all tournaments: ${error}`);
      return [];
    }
  }

  /**
   * Получить турнир по индексу
   */
  async getTournamentByIndex(index: number): Promise<TournamentInfo | null> {
    this.logStep(`Getting tournament by index: ${index}`);
    
    try {
      const tournament = await this.tournamentPage.getTournamentInfo(index);
      if (tournament) {
        this.logSuccess(`Tournament retrieved by index ${index}: ${tournament.title}`);
        return { index, ...tournament };
      } else {
        this.logError(`Tournament not found by index ${index}`);
        return null;
      }
    } catch (error) {
      this.logError(`Failed to get tournament by index ${index}: ${error}`);
      return null;
    }
  }

  /**
   * Найти турнир по названию
   */
  async findTournamentByTitle(title: string): Promise<TournamentInfo | null> {
    this.logStep(`Finding tournament by title: ${title}`);
    
    try {
      const allTournaments = await this.getAllTournaments();
      const tournament = allTournaments.find(t => 
        t.title.toLowerCase().includes(title.toLowerCase())
      );
      
      if (tournament) {
        this.logSuccess(`Tournament found by title: ${title}`);
        return tournament;
      } else {
        this.logError(`Tournament not found by title: ${title}`);
        return null;
      }
    } catch (error) {
      this.logError(`Failed to find tournament by title ${title}: ${error}`);
      return null;
    }
  }

  /**
   * Получить активные турниры
   */
  async getActiveTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting active tournaments');
    
    try {
      const activeTournaments = await this.tournamentPage.getActiveTournaments();
      this.logSuccess(`Found ${activeTournaments.length} active tournaments`);
      return activeTournaments;
    } catch (error) {
      this.logError(`Failed to get active tournaments: ${error}`);
      return [];
    }
  }

  /**
   * Получить завершенные турниры
   */
  async getCompletedTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting completed tournaments');
    
    try {
      const completedTournaments = await this.tournamentPage.getCompletedTournaments();
      this.logSuccess(`Found ${completedTournaments.length} completed tournaments`);
      return completedTournaments;
    } catch (error) {
      this.logError(`Failed to get completed tournaments: ${error}`);
      return [];
    }
  }

  /**
   * Открыть детали турнира по индексу
   */
  async openTournamentDetails(index: number): Promise<boolean> {
    this.logStep(`Opening tournament details by index: ${index}`);
    
    try {
      const success = await this.tournamentPage.clickDetailsButtonByIndex(index);
      if (success) {
        await this.tournamentModal.waitForModalOpen();
        this.logSuccess(`Tournament details opened for index ${index}`);
      } else {
        this.logError(`Failed to open tournament details for index ${index}`);
      }
      return success;
    } catch (error) {
      this.logError(`Failed to open tournament details by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Принять участие в турнире по индексу
   */
  async participateInTournament(index: number): Promise<boolean> {
    this.logStep(`Participating in tournament by index: ${index}`);
    
    try {
      const success = await this.tournamentPage.clickParticipateButtonByIndex(index);
      if (success) {
        this.logSuccess(`Participated in tournament by index ${index}`);
      } else {
        this.logError(`Failed to participate in tournament by index ${index}`);
      }
      return success;
    } catch (error) {
      this.logError(`Failed to participate in tournament by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Закрыть модальное окно турнира
   */
  async closeTournamentModal(): Promise<void> {
    this.logStep('Closing tournament modal');
    
    try {
      await this.tournamentModal.closeModal();
      this.logSuccess('Tournament modal closed');
    } catch (error) {
      this.logError(`Failed to close tournament modal: ${error}`);
      throw error;
    }
  }

  /**
   * Получить информацию о турнире из модального окна
   */
  async getTournamentModalInfo(): Promise<any> {
    this.logStep('Getting tournament modal info');
    
    try {
      const modalInfo = await this.tournamentModal.getModalInfo();
      this.logSuccess('Tournament modal info retrieved');
      return modalInfo;
    } catch (error) {
      this.logError(`Failed to get tournament modal info: ${error}`);
      return null;
    }
  }

  /**
   * Принять участие в турнире через модальное окно
   */
  async participateInTournamentViaModal(): Promise<boolean> {
    this.logStep('Participating in tournament via modal');
    
    try {
      const success = await this.tournamentModal.clickParticipateButton();
      if (success) {
        this.logSuccess('Participated in tournament via modal');
      } else {
        this.logError('Failed to participate in tournament via modal');
      }
      return success;
    } catch (error) {
      this.logError(`Failed to participate in tournament via modal: ${error}`);
      return false;
    }
  }

  /**
   * Получить статистику страницы турниров
   */
  async getTournamentPageStats(): Promise<TournamentPageStats> {
    this.logStep('Getting tournament page stats');
    
    try {
      const stats = await this.tournamentPage.getPageStats();
      this.logSuccess('Tournament page stats retrieved');
      return stats;
    } catch (error) {
      this.logError(`Failed to get tournament page stats: ${error}`);
      return {
        tournamentsCount: 0,
        activeTournaments: 0,
        completedTournaments: 0,
        hasTournaments: false,
        imagesLoaded: false
      };
    }
  }

  /**
   * Поиск турниров с фильтрами
   */
  async searchTournaments(filters: TournamentFilters): Promise<TournamentSearchResult> {
    this.logStep('Searching tournaments with filters');
    
    try {
      let tournaments: TournamentInfo[] = [];
      
      if (filters.status === 'active') {
        tournaments = await this.getActiveTournaments();
      } else if (filters.status === 'completed') {
        tournaments = await this.getCompletedTournaments();
      } else {
        tournaments = await this.getAllTournaments();
      }
      
      // Фильтрация по призовому фонду
      if (filters.prizeFundMin || filters.prizeFundMax) {
        tournaments = tournaments.filter(tournament => {
          const prizeFund = tournament.prizeFund;
          const prizeAmount = parseInt(prizeFund.replace(/[^\d]/g, '')) || 0;
          
          if (filters.prizeFundMin && prizeAmount < filters.prizeFundMin) {
            return false;
          }
          
          if (filters.prizeFundMax && prizeAmount > filters.prizeFundMax) {
            return false;
          }
          
          return true;
        });
      }
      
      const activeCount = tournaments.filter(t => 
        !t.status.toLowerCase().includes('завершився') && 
        !t.status.toLowerCase().includes('завершено')
      ).length;
      
      const completedCount = tournaments.length - activeCount;
      
      this.logSuccess(`Found ${tournaments.length} tournaments with filters`);
      
      return {
        tournaments,
        totalCount: tournaments.length,
        activeCount,
        completedCount
      };
    } catch (error) {
      this.logError(`Failed to search tournaments: ${error}`);
      return {
        tournaments: [],
        totalCount: 0,
        activeCount: 0,
        completedCount: 0
      };
    }
  }

  /**
   * Проверить, есть ли турниры на странице
   */
  async hasTournaments(): Promise<boolean> {
    this.logStep('Checking if tournaments are present');
    
    try {
      const hasTournaments = await this.tournamentPage.hasTournaments();
      this.logStep(`Tournaments present: ${hasTournaments}`);
      return hasTournaments;
    } catch (error) {
      this.logError(`Failed to check tournaments presence: ${error}`);
      return false;
    }
  }

  /**
   * Дождаться загрузки всех изображений турниров
   */
  async waitForAllTournamentImagesLoad(): Promise<void> {
    this.logStep('Waiting for all tournament images to load');
    
    try {
      await this.tournamentPage.waitForAllTournamentImagesLoad();
      this.logSuccess('All tournament images loaded');
    } catch (error) {
      this.logError(`Failed to wait for tournament images: ${error}`);
    }
  }

  /**
   * Прокрутить к турниру по индексу
   */
  async scrollToTournament(index: number): Promise<boolean> {
    this.logStep(`Scrolling to tournament by index: ${index}`);
    
    try {
      const success = await this.tournamentPage.scrollToTournamentByIndex(index);
      if (success) {
        this.logSuccess(`Scrolled to tournament by index ${index}`);
      } else {
        this.logError(`Failed to scroll to tournament by index ${index}`);
      }
      return success;
    } catch (error) {
      this.logError(`Failed to scroll to tournament by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, видим ли турнир по индексу
   */
  async isTournamentVisible(index: number): Promise<boolean> {
    this.logStep(`Checking if tournament is visible by index: ${index}`);
    
    try {
      const isVisible = await this.tournamentPage.isTournamentVisibleByIndex(index);
      this.logStep(`Tournament visible by index ${index}: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check tournament visibility by index ${index}: ${error}`);
      return false;
    }
  }
}
