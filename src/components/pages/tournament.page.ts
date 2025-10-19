/**
 * Tournament Page - Страница турниров (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BasePage } from '@/core/abstract/base-page';
import { TournamentPageComponent } from '@/components/pages/base-components/tournament-page.component';
import { PageHeaderComponent } from '@/components/pages/base-components/page-header.component';
import { PageContentComponent } from '@/components/pages/base-components/page-content.component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { TournamentInfo, TournamentPageStats } from '@/types/tournament.types';

export class TournamentPage extends BasePage {
  private readonly tournamentComponent: TournamentPageComponent;
  private readonly pageHeader: PageHeaderComponent;
  private readonly pageContent: PageContentComponent;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'TournamentPage', '/tournaments', 'Турнири', loggerInstance);
    
    this.tournamentComponent = new TournamentPageComponent(page, loggerInstance);
    this.pageHeader = new PageHeaderComponent(page, loggerInstance);
    this.pageContent = new PageContentComponent(page, loggerInstance);
  }

  // ============ НАВИГАЦИЯ ============
  
  async navigateToTournaments(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    this.logStep('Waiting for tournament page to load');
    await this.pageContent.waitForContentLoad();
    await this.tournamentComponent.waitForTournamentsLoad();
    this.logSuccess('Tournament page loaded');
  }

  // ============ РАБОТА С ТУРНИРАМИ ============
  
  async getAllTournaments(): Promise<TournamentInfo[]> {
    return await this.tournamentComponent.getAllTournaments();
  }

  async getTournamentByIndex(index: number): Promise<TournamentInfo | null> {
    return await this.tournamentComponent.getTournamentByIndex(index);
  }

  async clickTournamentDetails(index: number): Promise<void> {
    await this.tournamentComponent.clickTournamentDetails(index);
  }

  async clickTournamentParticipate(index: number): Promise<void> {
    await this.tournamentComponent.clickTournamentParticipate(index);
  }

  async searchTournaments(query: string): Promise<void> {
    await this.tournamentComponent.searchTournaments(query);
  }

  async filterTournaments(filterValue: string): Promise<void> {
    await this.tournamentComponent.filterTournaments(filterValue);
  }

  async sortTournaments(sortValue: string): Promise<void> {
    await this.tournamentComponent.sortTournaments(sortValue);
  }

  // ============ СТАТИСТИКА ============
  
  async getPageStats(): Promise<TournamentPageStats> {
    return await this.tournamentComponent.getPageStats();
  }

  async isTournamentsLoaded(): Promise<boolean> {
    return await this.tournamentComponent.isTournamentsLoaded();
  }

  // ============ ВАЛИДАЦИЯ ============
  
  async validateTournamentPage(): Promise<boolean> {
    this.logStep('Validating tournament page');
    
    const isOnCorrectPage = await this.isOnPage();
    const hasCorrectTitle = await this.hasCorrectTitle();
    const isContentLoaded = await this.pageContent.isContentLoaded();
    const hasTournaments = await this.isTournamentsLoaded();
    
    const isValid = isOnCorrectPage && hasCorrectTitle && isContentLoaded && hasTournaments;
    
    if (isValid) {
      this.logSuccess('Tournament page validation passed');
    } else {
      this.logError('Tournament page validation failed');
    }
    
    return isValid;
  }

  // ============ ГЕТТЕРЫ ============
  
  get tournamentPageComponent(): TournamentPageComponent {
    return this.tournamentComponent;
  }

  get pageHeaderComponent(): PageHeaderComponent {
    return this.pageHeader;
  }

  get pageContentComponent(): PageContentComponent {
    return this.pageContent;
  }
}
