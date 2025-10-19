/**
 * Tournament Service - Сервис для работы с турнирами
 */

import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { TournamentModalComponent } from '@/components/modals/tournament-modal';
import { ILogger } from '@/core/interfaces/logger.interface';
import { logger } from '@/core/logger';
import { 
  TournamentInfo, 
  TournamentModalInfo, 
  TournamentTimerInfo, 
  TournamentPrize,
  TournamentPageStats,
  TournamentFilters,
  TournamentSearchResult
} from '@/types/tournament.types';

export class TournamentService extends BaseService {
  private readonly tournamentModal: TournamentModalComponent;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'TournamentService', loggerInstance || logger);
    this.tournamentModal = new TournamentModalComponent(page, loggerInstance);
  }

  // ============ ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ТУРНИРАХ ============
  
  async getAllTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting all tournaments');
    
    try {
      const tournamentCards = await this.page.locator('.tournament-card').all();
      const tournaments: TournamentInfo[] = [];
      
      for (let i = 0; i < tournamentCards.length; i++) {
        const card = tournamentCards[i];
        const tournament = await this.extractTournamentInfo(card, i);
        tournaments.push(tournament);
      }
      
      this.logSuccess(`Found ${tournaments.length} tournaments`);
      return tournaments;
    } catch (error) {
      this.logError(`Failed to get tournaments: ${error}`);
      return [];
    }
  }

  async getTournamentByIndex(index: number): Promise<TournamentInfo | null> {
    this.logStep(`Getting tournament by index: ${index}`);
    
    try {
      const tournamentCards = await this.page.locator('.tournament-card').all();
      
      if (index >= 0 && index < tournamentCards.length) {
        const card = tournamentCards[index];
        const tournament = await this.extractTournamentInfo(card, index);
        this.logSuccess(`Tournament found at index ${index}: ${tournament.title}`);
        return tournament;
      }
      
      this.logError(`Tournament not found at index: ${index}`);
      return null;
    } catch (error) {
      this.logError(`Failed to get tournament by index ${index}: ${error}`);
      return null;
    }
  }

  async getActiveTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting active tournaments');
    
    try {
      const allTournaments = await this.getAllTournaments();
      const activeTournaments = allTournaments.filter(t => t.status === 'active');
      
      this.logSuccess(`Found ${activeTournaments.length} active tournaments`);
      return activeTournaments;
    } catch (error) {
      this.logError(`Failed to get active tournaments: ${error}`);
      return [];
    }
  }

  async getCompletedTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting completed tournaments');
    
    try {
      const allTournaments = await this.getAllTournaments();
      const completedTournaments = allTournaments.filter(t => t.status === 'completed');
      
      this.logSuccess(`Found ${completedTournaments.length} completed tournaments`);
      return completedTournaments;
    } catch (error) {
      this.logError(`Failed to get completed tournaments: ${error}`);
      return [];
    }
  }

  // ============ РАБОТА С МОДАЛЬНЫМ ОКНОМ ТУРНИРА ============
  
  async openTournamentDetails(tournamentIndex: number): Promise<void> {
    this.logStep(`Opening tournament details for index: ${tournamentIndex}`);
    
    try {
      const tournamentCard = this.page.locator('.tournament-card').nth(tournamentIndex);
      const detailsButton = tournamentCard.locator('[data-testid="tournament-details"]');
      
      await detailsButton.click();
      await this.tournamentModal.waitForOpen();
      
      this.logSuccess('Tournament details opened');
    } catch (error) {
      this.logError(`Failed to open tournament details: ${error}`);
      throw error;
    }
  }

  async participateInTournament(tournamentIndex: number): Promise<void> {
    this.logStep(`Participating in tournament: ${tournamentIndex}`);
    
    try {
      const tournamentCard = this.page.locator('.tournament-card').nth(tournamentIndex);
      const participateButton = tournamentCard.locator('[data-testid="tournament-participate"]');
      
      await participateButton.click();
      await this.tournamentModal.waitForOpen();
      await this.tournamentModal.participateInTournament();
      
      this.logSuccess('Tournament participation completed');
    } catch (error) {
      this.logError(`Failed to participate in tournament: ${error}`);
      throw error;
    }
  }

  async getTournamentModalInfo(): Promise<TournamentModalInfo> {
    this.logStep('Getting tournament modal information');
    
    try {
      const title = await this.tournamentModal.getTitle();
      const description = await this.tournamentModal.getChildText('.tournament-description');
      const prizeFund = await this.tournamentModal.getChildText('.prize-fund');
      const rules = await this.tournamentModal.getChildText('.tournament-rules');
      const participationInfo = await this.tournamentModal.getChildText('.participation-info');
      
      const info: TournamentModalInfo = {
        title,
        description,
        prizeFund,
        rules,
        participationInfo
      };
      
      this.logSuccess('Tournament modal information retrieved');
      return info;
    } catch (error) {
      this.logError(`Failed to get tournament modal info: ${error}`);
      throw error;
    }
  }

  async getTournamentTimerInfo(): Promise<TournamentTimerInfo> {
    this.logStep('Getting tournament timer information');
    
    try {
      const timeRemaining = await this.tournamentModal.getChildText('.timer');
      const isActive = await this.tournamentModal.isChildVisible('.timer.active');
      
      const timerInfo: TournamentTimerInfo = {
        timeRemaining,
        isActive
      };
      
      this.logSuccess('Tournament timer information retrieved');
      return timerInfo;
    } catch (error) {
      this.logError(`Failed to get tournament timer info: ${error}`);
      throw error;
    }
  }

  async getTournamentPrizesTable(): Promise<TournamentPrize[]> {
    this.logStep('Getting tournament prizes table');
    
    try {
      const prizeRows = await this.tournamentModal.findChild('.prizes-table tbody tr').all();
      const prizes: TournamentPrize[] = [];
      
      for (const row of prizeRows) {
        const position = await row.locator('td:first-child').textContent() || '';
        const prize = await row.locator('td:last-child').textContent() || '';
        
        prizes.push({ position, prize });
      }
      
      this.logSuccess(`Retrieved ${prizes.length} prizes`);
      return prizes;
    } catch (error) {
      this.logError(`Failed to get tournament prizes: ${error}`);
      return [];
    }
  }

  // ============ ФИЛЬТРАЦИЯ И ПОИСК ============
  
  async searchTournaments(query: string): Promise<TournamentSearchResult> {
    this.logStep(`Searching tournaments with query: ${query}`);
    
    try {
      const searchInput = this.page.locator('[data-testid="tournament-search"]');
      await searchInput.fill(query);
      await this.page.waitForTimeout(1000); // Wait for search results
      
      const tournaments = await this.getAllTournaments();
      const filteredTournaments = tournaments.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      
      const result: TournamentSearchResult = {
        tournaments: filteredTournaments,
        totalCount: filteredTournaments.length,
        activeCount: filteredTournaments.filter(t => t.status === 'active').length,
        completedCount: filteredTournaments.filter(t => t.status === 'completed').length
      };
      
      this.logSuccess(`Found ${result.totalCount} tournaments matching "${query}"`);
      return result;
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

  async filterTournaments(filters: TournamentFilters): Promise<TournamentInfo[]> {
    this.logStep('Filtering tournaments');
    
    try {
      let tournaments = await this.getAllTournaments();
      
      if (filters.status && filters.status !== 'all') {
        tournaments = tournaments.filter(t => t.status === filters.status);
      }
      
      if (filters.prizeFundMin !== undefined) {
        tournaments = tournaments.filter(t => {
          const prizeFund = parseFloat(t.prizeFund.replace(/[^\d.]/g, ''));
          return prizeFund >= filters.prizeFundMin!;
        });
      }
      
      if (filters.prizeFundMax !== undefined) {
        tournaments = tournaments.filter(t => {
          const prizeFund = parseFloat(t.prizeFund.replace(/[^\d.]/g, ''));
          return prizeFund <= filters.prizeFundMax!;
        });
      }
      
      this.logSuccess(`Filtered to ${tournaments.length} tournaments`);
      return tournaments;
    } catch (error) {
      this.logError(`Failed to filter tournaments: ${error}`);
      return [];
    }
  }

  // ============ СТАТИСТИКА СТРАНИЦЫ ============
  
  async getPageStats(): Promise<TournamentPageStats> {
    this.logStep('Getting tournament page statistics');
    
    try {
      const allTournaments = await this.getAllTournaments();
      const activeTournaments = allTournaments.filter(t => t.status === 'active');
      const completedTournaments = allTournaments.filter(t => t.status === 'completed');
      
      // Check if images are loaded
      const images = await this.page.locator('.tournament-card img').all();
      let imagesLoaded = true;
      
      for (const img of images) {
        const isLoaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalHeight !== 0);
        if (!isLoaded) {
          imagesLoaded = false;
          break;
        }
      }
      
      const stats: TournamentPageStats = {
        tournamentsCount: allTournaments.length,
        activeTournaments: activeTournaments.length,
        completedTournaments: completedTournaments.length,
        hasTournaments: allTournaments.length > 0,
        imagesLoaded
      };
      
      this.logSuccess('Tournament page statistics retrieved');
      return stats;
    } catch (error) {
      this.logError(`Failed to get page stats: ${error}`);
      return {
        tournamentsCount: 0,
        activeTournaments: 0,
        completedTournaments: 0,
        hasTournaments: false,
        imagesLoaded: false
      };
    }
  }

  // ============ ПРИВАТНЫЕ МЕТОДЫ ============
  
  private async extractTournamentInfo(card: any, index: number): Promise<TournamentInfo> {
    const title = await card.locator('.tournament-title').textContent() || '';
    const excerpt = await card.locator('.tournament-excerpt').textContent() || '';
    const prizeFund = await card.locator('.prize-fund').textContent() || '';
    const status = await card.locator('.tournament-status').textContent() || '';
    const hasDetailsButton = await card.locator('[data-testid="tournament-details"]').isVisible();
    const hasParticipateButton = await card.locator('[data-testid="tournament-participate"]').isVisible();
    
    return {
      index,
      title,
      excerpt,
      prizeFund,
      status: status.toLowerCase(),
      hasDetailsButton,
      hasParticipateButton
    };
  }
}