/**
 * Tournament Page - Страница турниров
 */

import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/base.page';

export class TournamentPage extends BasePage {
  
  // Основные селекторы страницы
  get pageTitleTournament(): Locator {
    return this.page.locator('h3.page-title');
  }
  
  get tournamentContainer(): Locator {
    return this.page.locator('.container .row.flex-col.gap-lg');
  }
  
  get tournamentCards(): Locator {
    return this.page.locator('.card.card-promotion.card-unevenly');
  }
  
  // Селекторы для карточки турнира
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
    return this.page.locator('.badge.round.bg-green-opacity.border-green');
  }
  
  get tournamentButtons(): Locator {
    return this.page.locator('.button-wrapper .btn');
  }
  
  get detailsButton(): Locator {
    return this.page.locator('button[onclick*="showModalFromRoot"]');
  }
  
  get participateButton(): Locator {
    return this.page.locator('button:has-text("Прийняти участь")');
  }
  
  // Селекторы для таймеров
  get tournamentTimers(): Locator {
    return this.page.locator('[id^="timerTournament"]');
  }
  
  constructor(page: Page) {
    super(page, 'TournamentPage', '/tournament');
  }

  /**
   * Дождаться загрузки страницы турниров
   */
  async waitForPageLoad(): Promise<void> {
    this.logStep('Waiting for tournament page to load');
    
    try {
      await this.pageTitleTournament.waitFor({ state: 'visible', timeout: 10000 });
      await this.tournamentContainer.waitFor({ state: 'visible', timeout: 10000 });
      await this.tournamentCards.first().waitFor({ state: 'visible', timeout: 10000 });
      
      this.logSuccess('Tournament page loaded');
    } catch (error) {
      this.logError(`Failed to load tournament page: ${error}`);
      throw error;
    }
  }

  /**
   * Получить количество турниров на странице
   */
  async getTournamentsCount(): Promise<number> {
    this.logStep('Getting tournaments count');
    
    try {
      const count = await this.tournamentCards.count();
      this.logSuccess(`Found ${count} tournaments`);
      return count;
    } catch (error) {
      this.logError(`Failed to get tournaments count: ${error}`);
      return 0;
    }
  }

  /**
   * Получить информацию о турнире по индексу
   */
  async getTournamentInfo(index: number): Promise<{
    title: string;
    excerpt: string;
    prizeFund: string;
    status: string;
    hasDetailsButton: boolean;
    hasParticipateButton: boolean;
  } | null> {
    this.logStep(`Getting tournament info by index: ${index}`);
    
    try {
      const tournaments = await this.tournamentCards.all();
      
      if (index < 0 || index >= tournaments.length) {
        this.logError(`Tournament index ${index} is out of range. Available tournaments: ${tournaments.length}`);
        return null;
      }
      
      const tournament = tournaments[index];
      
      const title = await tournament.locator('.title').textContent() || '';
      const excerpt = await tournament.locator('.excerpt').textContent() || '';
      const prizeFund = await tournament.locator('.badge.bg-blue-opacity').textContent() || '';
      const status = await tournament.locator('.badge.bg-green-opacity').textContent() || '';
      
      const hasDetailsButton = await tournament.locator('button[onclick*="showModalFromRoot"]').count() > 0;
      const hasParticipateButton = await tournament.locator('button:has-text("Прийняти участь")').count() > 0;
      
      this.logSuccess(`Tournament info retrieved: ${title}`);
      
      return {
        title: title.trim(),
        excerpt: excerpt.trim(),
        prizeFund: prizeFund.trim(),
        status: status.trim(),
        hasDetailsButton,
        hasParticipateButton
      };
    } catch (error) {
      this.logError(`Failed to get tournament info by index ${index}: ${error}`);
      return null;
    }
  }

  /**
   * Найти турнир по названию
   */
  async findTournamentByTitle(title: string): Promise<boolean> {
    this.logStep(`Finding tournament by title: ${title}`);
    
    try {
      const tournaments = await this.tournamentCards.all();
      
      for (const tournament of tournaments) {
        const tournamentTitle = await tournament.locator('.title').textContent();
        if (tournamentTitle && tournamentTitle.toLowerCase().includes(title.toLowerCase())) {
          this.logSuccess(`Tournament found: ${title}`);
          return true;
        }
      }
      
      this.logError(`Tournament not found: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to find tournament: ${error}`);
      return false;
    }
  }

  /**
   * Кликнуть по кнопке "Деталі" для турнира по индексу
   */
  async clickDetailsButtonByIndex(index: number): Promise<boolean> {
    this.logStep(`Clicking details button for tournament by index: ${index}`);
    
    try {
      const tournaments = await this.tournamentCards.all();
      
      if (index < 0 || index >= tournaments.length) {
        this.logError(`Tournament index ${index} is out of range. Available tournaments: ${tournaments.length}`);
        return false;
      }
      
      const tournament = tournaments[index];
      const detailsButton = tournament.locator('button[onclick*="showModalFromRoot"]');
      
      if (await detailsButton.count() > 0) {
        await detailsButton.click();
        this.logSuccess(`Details button clicked for tournament by index ${index}`);
        return true;
      } else {
        this.logError(`Details button not found for tournament by index ${index}`);
        return false;
      }
    } catch (error) {
      this.logError(`Failed to click details button for tournament by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Кликнуть по кнопке "Прийняти участь" для турнира по индексу
   */
  async clickParticipateButtonByIndex(index: number): Promise<boolean> {
    this.logStep(`Clicking participate button for tournament by index: ${index}`);
    
    try {
      const tournaments = await this.tournamentCards.all();
      
      if (index < 0 || index >= tournaments.length) {
        this.logError(`Tournament index ${index} is out of range. Available tournaments: ${tournaments.length}`);
        return false;
      }
      
      const tournament = tournaments[index];
      const participateButton = tournament.locator('button:has-text("Прийняти участь")');
      
      if (await participateButton.count() > 0) {
        await participateButton.click();
        this.logSuccess(`Participate button clicked for tournament by index ${index}`);
        return true;
      } else {
        this.logError(`Participate button not found for tournament by index ${index}`);
        return false;
      }
    } catch (error) {
      this.logError(`Failed to click participate button for tournament by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Получить все турниры с их информацией
   */
  async getAllTournamentsInfo(): Promise<Array<{
    index: number;
    title: string;
    excerpt: string;
    prizeFund: string;
    status: string;
    hasDetailsButton: boolean;
    hasParticipateButton: boolean;
  }>> {
    this.logStep('Getting all tournaments info');
    
    try {
      const tournaments = await this.tournamentCards.all();
      const tournamentsInfo = [];
      
      for (let i = 0; i < tournaments.length; i++) {
        const tournamentInfo = await this.getTournamentInfo(i);
        if (tournamentInfo) {
          tournamentsInfo.push({
            index: i,
            ...tournamentInfo
          });
        }
      }
      
      this.logSuccess(`Retrieved info for ${tournamentsInfo.length} tournaments`);
      return tournamentsInfo;
    } catch (error) {
      this.logError(`Failed to get all tournaments info: ${error}`);
      return [];
    }
  }

  /**
   * Получить турниры по статусу
   */
  async getTournamentsByStatus(status: string): Promise<Array<{
    index: number;
    title: string;
    excerpt: string;
    prizeFund: string;
    status: string;
    hasDetailsButton: boolean;
    hasParticipateButton: boolean;
  }>> {
    this.logStep(`Getting tournaments by status: ${status}`);
    
    try {
      const allTournaments = await this.getAllTournamentsInfo();
      const filteredTournaments = allTournaments.filter(tournament => 
        tournament.status.toLowerCase().includes(status.toLowerCase())
      );
      
      this.logSuccess(`Found ${filteredTournaments.length} tournaments with status: ${status}`);
      return filteredTournaments;
    } catch (error) {
      this.logError(`Failed to get tournaments by status: ${error}`);
      return [];
    }
  }

  /**
   * Получить активные турниры (не завершенные)
   */
  async getActiveTournaments(): Promise<Array<{
    index: number;
    title: string;
    excerpt: string;
    prizeFund: string;
    status: string;
    hasDetailsButton: boolean;
    hasParticipateButton: boolean;
  }>> {
    this.logStep('Getting active tournaments');
    
    try {
      const allTournaments = await this.getAllTournamentsInfo();
      const activeTournaments = allTournaments.filter(tournament => 
        !tournament.status.toLowerCase().includes('завершився') &&
        !tournament.status.toLowerCase().includes('завершено')
      );
      
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
  async getCompletedTournaments(): Promise<Array<{
    index: number;
    title: string;
    excerpt: string;
    prizeFund: string;
    status: string;
    hasDetailsButton: boolean;
    hasParticipateButton: boolean;
  }>> {
    this.logStep('Getting completed tournaments');
    
    try {
      const allTournaments = await this.getAllTournamentsInfo();
      const completedTournaments = allTournaments.filter(tournament => 
        tournament.status.toLowerCase().includes('завершився') ||
        tournament.status.toLowerCase().includes('завершено')
      );
      
      this.logSuccess(`Found ${completedTournaments.length} completed tournaments`);
      return completedTournaments;
    } catch (error) {
      this.logError(`Failed to get completed tournaments: ${error}`);
      return [];
    }
  }

  /**
   * Проверить, есть ли турниры на странице
   */
  async hasTournaments(): Promise<boolean> {
    this.logStep('Checking if tournaments are present on page');
    
    try {
      const count = await this.tournamentCards.count();
      const hasTournaments = count > 0;
      this.logStep(`Tournaments present: ${hasTournaments} (${count} tournaments)`);
      return hasTournaments;
    } catch (error) {
      this.logError(`Failed to check tournaments presence: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, загружены ли все изображения турниров
   */
  async areAllTournamentImagesLoaded(): Promise<boolean> {
    this.logStep('Checking if all tournament images are loaded');
    
    try {
      const images = await this.tournamentImage.all();
      let allLoaded = true;
      
      for (const image of images) {
        const isLoaded = await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalHeight !== 0);
        if (!isLoaded) {
          allLoaded = false;
          break;
        }
      }
      
      this.logStep(`All tournament images loaded: ${allLoaded}`);
      return allLoaded;
    } catch (error) {
      this.logError(`Failed to check tournament images: ${error}`);
      return false;
    }
  }

  /**
   * Дождаться загрузки всех изображений турниров
   */
  async waitForAllTournamentImagesLoad(): Promise<void> {
    this.logStep('Waiting for all tournament images to load');
    
    try {
      const images = await this.tournamentImage.all();
      
      for (const image of images) {
        await image.waitFor({ state: 'visible', timeout: 10000 });
      }
      
      this.logSuccess('All tournament images loaded');
    } catch (error) {
      this.logError(`Failed to wait for tournament images: ${error}`);
    }
  }

  /**
   * Получить статистику страницы турниров
   */
  async getPageStats(): Promise<{
    tournamentsCount: number;
    activeTournaments: number;
    completedTournaments: number;
    hasTournaments: boolean;
    imagesLoaded: boolean;
  }> {
    this.logStep('Getting tournament page stats');
    
    try {
      const tournamentsCount = await this.getTournamentsCount();
      const activeTournaments = await this.getActiveTournaments();
      const completedTournaments = await this.getCompletedTournaments();
      const hasTournaments = await this.hasTournaments();
      const imagesLoaded = await this.areAllTournamentImagesLoaded();
      
      const stats = {
        tournamentsCount,
        activeTournaments: activeTournaments.length,
        completedTournaments: completedTournaments.length,
        hasTournaments,
        imagesLoaded
      };
      
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
   * Прокрутить к турниру по индексу
   */
  async scrollToTournamentByIndex(index: number): Promise<boolean> {
    this.logStep(`Scrolling to tournament by index: ${index}`);
    
    try {
      const tournaments = await this.tournamentCards.all();
      
      if (index < 0 || index >= tournaments.length) {
        this.logError(`Tournament index ${index} is out of range. Available tournaments: ${tournaments.length}`);
        return false;
      }
      
      const tournament = tournaments[index];
      await tournament.scrollIntoViewIfNeeded();
      
      this.logSuccess(`Scrolled to tournament by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to scroll to tournament by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, видим ли турнир по индексу
   */
  async isTournamentVisibleByIndex(index: number): Promise<boolean> {
    this.logStep(`Checking if tournament is visible by index: ${index}`);
    
    try {
      const tournaments = await this.tournamentCards.all();
      
      if (index < 0 || index >= tournaments.length) {
        this.logError(`Tournament index ${index} is out of range. Available tournaments: ${tournaments.length}`);
        return false;
      }
      
      const tournament = tournaments[index];
      const isVisible = await tournament.isVisible();
      
      this.logStep(`Tournament visible by index ${index}: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check tournament visibility by index ${index}: ${error}`);
      return false;
    }
  }
}
