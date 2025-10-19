/**
 * Tournament Page Component - Компонент страницы турниров
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { TournamentInfo, TournamentPageStats } from '@/types/tournament.types';

export class TournamentPageComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'TournamentPage', '.tournament-page', loggerInstance);
  }

  // Селекторы страницы турниров
  get pageTitle(): Locator {
    return this.page.locator('h3.page-title');
  }

  get tournamentContainer(): Locator {
    return this.page.locator('main, .main-content, .content, body');
  }

  get tournamentCards(): Locator {
    return this.page.locator('.card.card-promotion.card-unevenly');
  }

  get tournamentCard(): Locator {
    return this.page.locator('.card.card-promotion.card-unevenly');
  }

  get tournamentImage(): Locator {
    return this.page.locator('.card-image-wrapper .card-image');
  }

  get tournamentContent(): Locator {
    return this.page.locator('.card-content-wrapper');
  }

  get tournamentTitle(): Locator {
    return this.page.locator('.card-content-wrapper .title');
  }

  get tournamentExcerpt(): Locator {
    return this.page.locator('.card-content-wrapper .excerpt');
  }

  get tournamentBadges(): Locator {
    return this.page.locator('.short-info-tournament .badge');
  }

  get prizeFundBadge(): Locator {
    return this.page.locator('.badge.bg-blue-opacity.border-blue.round');
  }

  get statusBadge(): Locator {
    return this.page.locator('.badge.bg-green-opacity.border-green.round');
  }

  get detailsButton(): Locator {
    return this.page.locator('.btn-outline');
  }

  get participateButton(): Locator {
    return this.page.locator('.btn-default');
  }

  get timer(): Locator {
    return this.page.locator('.timer');
  }

  get searchInput(): Locator {
    return this.page.locator('[data-testid="tournament-search"]');
  }

  get filterDropdown(): Locator {
    return this.page.locator('[data-testid="tournament-filter"]');
  }

  get sortDropdown(): Locator {
    return this.page.locator('[data-testid="tournament-sort"]');
  }

  // Методы для работы с турнирами
  async getAllTournaments(): Promise<TournamentInfo[]> {
    this.logStep('Getting all tournaments');
    
    try {
      const tournamentCards = await this.tournamentCards.all();
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
      const tournamentCards = await this.tournamentCards.all();
      
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

  async clickTournamentDetails(index: number): Promise<void> {
    this.logStep(`Clicking tournament details for index: ${index}`);
    
    try {
      const tournamentCard = this.tournamentCards.nth(index);
      const detailsButton = tournamentCard.locator('.btn-outline');
      
      await detailsButton.click();
      this.logSuccess('Tournament details clicked');
    } catch (error) {
      this.logError(`Failed to click tournament details: ${error}`);
      throw error;
    }
  }

  async clickTournamentParticipate(index: number): Promise<void> {
    this.logStep(`Clicking tournament participate for index: ${index}`);
    
    try {
      const tournamentCard = this.tournamentCards.nth(index);
      const participateButton = tournamentCard.locator('.btn-default');
      
      await participateButton.click();
      this.logSuccess('Tournament participate clicked');
    } catch (error) {
      this.logError(`Failed to click tournament participate: ${error}`);
      throw error;
    }
  }

  async searchTournaments(query: string): Promise<void> {
    this.logStep(`Searching tournaments with query: ${query}`);
    
    try {
      await this.searchInput.fill(query);
      await this.page.waitForTimeout(1000); // Wait for search results
      this.logSuccess(`Tournament search completed: ${query}`);
    } catch (error) {
      this.logError(`Failed to search tournaments: ${error}`);
      throw error;
    }
  }

  async filterTournaments(filterValue: string): Promise<void> {
    this.logStep(`Filtering tournaments with: ${filterValue}`);
    
    try {
      await this.filterDropdown.selectOption(filterValue);
      await this.page.waitForTimeout(1000); // Wait for filter results
      this.logSuccess(`Tournament filter applied: ${filterValue}`);
    } catch (error) {
      this.logError(`Failed to filter tournaments: ${error}`);
      throw error;
    }
  }

  async sortTournaments(sortValue: string): Promise<void> {
    this.logStep(`Sorting tournaments with: ${sortValue}`);
    
    try {
      await this.sortDropdown.selectOption(sortValue);
      await this.page.waitForTimeout(1000); // Wait for sort results
      this.logSuccess(`Tournament sort applied: ${sortValue}`);
    } catch (error) {
      this.logError(`Failed to sort tournaments: ${error}`);
      throw error;
    }
  }

  async getPageStats(): Promise<TournamentPageStats> {
    this.logStep('Getting tournament page statistics');
    
    try {
      const allTournaments = await this.getAllTournaments();
      const activeTournaments = allTournaments.filter(t => t.status === 'active');
      const completedTournaments = allTournaments.filter(t => t.status === 'completed');
      
      // Check if images are loaded
      const images = await this.tournamentImage.all();
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

  async waitForTournamentsLoad(): Promise<void> {
    this.logStep('Waiting for tournaments to load');
    await this.tournamentCards.first().waitFor({ state: 'visible' });
    this.logSuccess('Tournaments loaded');
  }

  async isTournamentsLoaded(): Promise<boolean> {
    const count = await this.tournamentCards.count();
    return count > 0;
  }

  // Приватные методы
  private async extractTournamentInfo(card: any, index: number): Promise<TournamentInfo> {
    const title = await card.locator('.title').textContent() || '';
    const excerpt = await card.locator('.excerpt').textContent() || '';
    const prizeFund = await card.locator('.badge.bg-blue-opacity').textContent() || '';
    const status = await card.locator('.badge.bg-green-opacity').textContent() || '';
    const hasDetailsButton = await card.locator('.btn-outline').isVisible();
    const hasParticipateButton = await card.locator('.btn-default').isVisible();
    
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
