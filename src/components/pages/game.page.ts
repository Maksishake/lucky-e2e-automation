/**
 * Game Page - Страница игры
 * Содержит все необходимые методы и функции для работы со страницей игры
 * Следует паттернам Page Object Model и архитектуре проекта
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameSelectors } from '@/core/selectors/GameSelectors';
import { GameInfo, GameType, GameStatus } from '@/types/game.types';

export class GamePage extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GamePage', '#screen-target', loggerInstance);
  }

  // ============ ОСНОВНЫЕ СЕЛЕКТОРЫ СТРАНИЦЫ ============

  // Контейнер игры
  get gameContainer(): Locator {
    return this.rootElement.locator(GameSelectors.GAME_CONTAINER);
  }

  get gameContainerWrapper(): Locator {
    return this.gameContainer.locator('.game-container-wrapper');
  }

  // Iframe игры
  get gameIframe(): Locator {
    return this.gameContainerWrapper.locator(GameSelectors.GAME_IFRAME);
  }

  // ============ СЕЛЕКТОРЫ ХЛЕБНЫХ КРОШЕК ============

  get breadcrumbs(): Locator {
    return this.rootElement.locator(GameSelectors.BREADCRUMBS);
  }

  get breadcrumbItems(): Locator {
    return this.breadcrumbs.locator(GameSelectors.BREADCRUMB_ITEMS);
  }

  get breadcrumbLinks(): Locator {
    return this.breadcrumbs.locator(GameSelectors.BREADCRUMB_LINKS);
  }

  get breadcrumbSeparators(): Locator {
    return this.breadcrumbs.locator('.separator');
  }

  // ============ СЕЛЕКТОРЫ ПАНЕЛИ УПРАВЛЕНИЯ ============

  get controlPanel(): Locator {
    return this.rootElement.locator('.row-card--game-breadcrumbs');
  }

  get gameModeToggle(): Locator {
    return this.controlPanel.locator(GameSelectors.GAME_MODE_TOGGLE);
  }

  get gameModeLabel(): Locator {
    return this.controlPanel.locator('label[for="switchs"]');
  }

  get gameModeText(): Locator {
    return this.controlPanel.locator('.text-white.body-semibold');
  }

  // ============ СЕЛЕКТОРЫ КНОПОК УПРАВЛЕНИЯ ============

  get buttonWrapper(): Locator {
    return this.controlPanel.locator('.button-wrapper');
  }

  get fullscreenButton(): Locator {
    return this.buttonWrapper.locator(GameSelectors.FULLSCREEN_BUTTON);
  }

  get fullscreenWideButton(): Locator {
    return this.buttonWrapper.locator(GameSelectors.FULLSCREEN_WIDE_BUTTON);
  }

  get favoriteButton(): Locator {
    return this.buttonWrapper.locator('button[wire\\:click="toggleFavorite"]');
  }

  get closeGameButton(): Locator {
    return this.buttonWrapper.locator('button[wire\\:click="closeGame"]');
  }

  // ============ СЕЛЕКТОРЫ МОБИЛЬНОЙ ПАНЕЛИ ============

  get mobileBottomPanel(): Locator {
    return this.gameContainerWrapper.locator(GameSelectors.MOBILE_BOTTOM_PANEL);
  }

  get lobbyButton(): Locator {
    return this.mobileBottomPanel.locator(GameSelectors.LOBBY_BUTTON);
  }

  get mobileCloseButton(): Locator {
    return this.mobileBottomPanel.locator(GameSelectors.MOBILE_CLOSE_BUTTON);
  }

  // ============ СЕЛЕКТОРЫ РЕКОМЕНДАЦИЙ ============

  get recommendationsSection(): Locator {
    return this.rootElement.locator(GameSelectors.RECOMMENDATIONS_SECTION);
  }

  get recommendationsSlider(): Locator {
    return this.recommendationsSection.locator(GameSelectors.RECOMMENDATIONS_SLIDER);
  }

  get recommendationsTitle(): Locator {
    return this.recommendationsSection.locator('.slider-title');
  }

  get viewAllButton(): Locator {
    return this.recommendationsSection.locator('button[wire\\:click="viewAll"]');
  }

  get sliderArrows(): Locator {
    return this.recommendationsSection.locator(GameSelectors.SLIDER_ARROWS);
  }

  get prevArrow(): Locator {
    return this.sliderArrows.locator(GameSelectors.PREV_ARROW);
  }

  get nextArrow(): Locator {
    return this.sliderArrows.locator(GameSelectors.NEXT_ARROW);
  }

  // ============ СЕЛЕКТОРЫ КАРТОЧЕК ИГР ============

  get gameCards(): Locator {
    return this.recommendationsSection.locator(GameSelectors.GAME_CARDS);
  }

  get gameCardImages(): Locator {
    return this.gameCards.locator(GameSelectors.GAME_IMAGE);
  }

  get gameCardTitles(): Locator {
    return this.gameCards.locator(GameSelectors.GAME_TITLE);
  }

  get gameCardSubtitles(): Locator {
    return this.gameCards.locator(GameSelectors.GAME_PROVIDER);
  }

  get gameCardHover(): Locator {
    return this.gameCards.locator('.game-card-hover');
  }

  get gameCardFavoriteButtons(): Locator {
    return this.gameCards.locator(GameSelectors.FAVORITE_BUTTON);
  }

  get gameCardButtons(): Locator {
    return this.gameCards.locator('.buttons');
  }

  get realGameButtons(): Locator {
    return this.gameCards.locator(GameSelectors.REAL_BUTTON);
  }

  get demoGameButtons(): Locator {
    return this.gameCards.locator(GameSelectors.DEMO_BUTTON);
  }

  // ============ МЕТОДЫ РАБОТЫ С ХЛЕБНЫМИ КРОШКАМИ ============

  async getBreadcrumbs(): Promise<string[]> {
    this.logStep('Getting breadcrumbs');
    try {
      const breadcrumbTexts: string[] = [];
      const items = await this.breadcrumbItems.all();
      
      for (const item of items) {
        const text = await item.textContent();
        if (text && text.trim()) {
          breadcrumbTexts.push(text.trim());
        }
      }
      
      this.logSuccess(`Found ${breadcrumbTexts.length} breadcrumbs`);
      return breadcrumbTexts;
    } catch (error) {
      this.logError('Failed to get breadcrumbs', error);
      return [];
    }
  }

  async clickBreadcrumb(index: number): Promise<void> {
    this.logStep(`Clicking breadcrumb at index: ${index}`);
    try {
      const link = this.breadcrumbLinks.nth(index);
      await link.click();
      this.logSuccess(`Clicked breadcrumb at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click breadcrumb at index: ${index}`, error);
      throw error;
    }
  }

  async getBreadcrumbText(index: number): Promise<string> {
    this.logStep(`Getting breadcrumb text at index: ${index}`);
    try {
      const text = await this.breadcrumbItems.nth(index).textContent() || '';
      this.logSuccess(`Breadcrumb text at index ${index}: ${text}`);
      return text.trim();
    } catch (error) {
      this.logError(`Failed to get breadcrumb text at index: ${index}`, error);
      return '';
    }
  }

  // ============ МЕТОДЫ РАБОТЫ С РЕЖИМОМ ИГРЫ ============

  async isRealModeEnabled(): Promise<boolean> {
    this.logStep('Checking if real mode is enabled');
    try {
      const isChecked = await this.gameModeToggle.isChecked();
      this.logStep(`Real mode enabled: ${isChecked}`);
      return isChecked;
    } catch (error) {
      this.logError('Failed to check game mode', error);
      return false;
    }
  }

  async toggleGameMode(): Promise<void> {
    this.logStep('Toggling game mode');
    try {
      await this.gameModeToggle.click();
      this.logSuccess('Game mode toggled');
    } catch (error) {
      this.logError('Failed to toggle game mode', error);
      throw error;
    }
  }

  async setRealMode(): Promise<void> {
    this.logStep('Setting real mode');
    try {
      const isRealMode = await this.isRealModeEnabled();
      if (!isRealMode) {
        await this.toggleGameMode();
      }
      this.logSuccess('Real mode set');
    } catch (error) {
      this.logError('Failed to set real mode', error);
      throw error;
    }
  }

  async setDemoMode(): Promise<void> {
    this.logStep('Setting demo mode');
    try {
      const isRealMode = await this.isRealModeEnabled();
      if (isRealMode) {
        await this.toggleGameMode();
      }
      this.logSuccess('Demo mode set');
    } catch (error) {
      this.logError('Failed to set demo mode', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ РАБОТЫ С IFRAME ============

  async isGameIframeVisible(): Promise<boolean> {
    this.logStep('Checking if game iframe is visible');
    try {
      const isVisible = await this.gameIframe.isVisible();
      this.logStep(`Game iframe visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError('Failed to check iframe visibility', error);
      return false;
    }
  }

  async getGameIframeSrc(): Promise<string> {
    this.logStep('Getting game iframe source');
    try {
      const src = await this.gameIframe.getAttribute('src') || '';
      this.logSuccess(`Game iframe source: ${src}`);
      return src;
    } catch (error) {
      this.logError('Failed to get iframe source', error);
      return '';
    }
  }

  async waitForGameIframeToLoad(): Promise<void> {
    this.logStep('Waiting for game iframe to load');
    try {
      await this.gameIframe.waitFor({ state: 'visible', timeout: 15000 });
      await this.gameIframe.waitFor({ state: 'attached', timeout: 10000 });
      this.logSuccess('Game iframe loaded');
    } catch (error) {
      this.logError('Game iframe did not load in time', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ РАБОТЫ С КНОПКАМИ УПРАВЛЕНИЯ ============

  async clickFullscreen(): Promise<void> {
    this.logStep('Clicking fullscreen button');
    try {
      await this.fullscreenButton.click();
      this.logSuccess('Fullscreen button clicked');
    } catch (error) {
      this.logError('Failed to click fullscreen button', error);
      throw error;
    }
  }

  async clickFullscreenWide(): Promise<void> {
    this.logStep('Clicking fullscreen wide button');
    try {
      await this.fullscreenWideButton.click();
      this.logSuccess('Fullscreen wide button clicked');
    } catch (error) {
      this.logError('Failed to click fullscreen wide button', error);
      throw error;
    }
  }

  async toggleFavorite(): Promise<void> {
    this.logStep('Toggling favorite');
    try {
      await this.favoriteButton.click();
      this.logSuccess('Favorite toggled');
    } catch (error) {
      this.logError('Failed to toggle favorite', error);
      throw error;
    }
  }

  async closeGame(): Promise<void> {
    this.logStep('Closing game');
    try {
      await this.closeGameButton.click();
      this.logSuccess('Game closed');
    } catch (error) {
      this.logError('Failed to close game', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ РАБОТЫ С МОБИЛЬНОЙ ПАНЕЛЬЮ ============

  async isMobilePanelVisible(): Promise<boolean> {
    this.logStep('Checking if mobile panel is visible');
    try {
      const isVisible = await this.mobileBottomPanel.isVisible();
      this.logStep(`Mobile panel visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError('Failed to check mobile panel visibility', error);
      return false;
    }
  }

  async clickLobbyButton(): Promise<void> {
    this.logStep('Clicking lobby button');
    try {
      await this.lobbyButton.click();
      this.logSuccess('Lobby button clicked');
    } catch (error) {
      this.logError('Failed to click lobby button', error);
      throw error;
    }
  }

  async clickMobileCloseButton(): Promise<void> {
    this.logStep('Clicking mobile close button');
    try {
      await this.mobileCloseButton.click();
      this.logSuccess('Mobile close button clicked');
    } catch (error) {
      this.logError('Failed to click mobile close button', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ РАБОТЫ С РЕКОМЕНДАЦИЯМИ ============

  async getRecommendationsCount(): Promise<number> {
    this.logStep('Getting recommendations count');
    try {
      const count = await this.gameCards.count();
      this.logSuccess(`Found ${count} recommendation cards`);
      return count;
    } catch (error) {
      this.logError('Failed to get recommendations count', error);
      return 0;
    }
  }

  async getRecommendationTitle(): Promise<string> {
    this.logStep('Getting recommendations title');
    try {
      const title = await this.recommendationsTitle.textContent() || '';
      this.logSuccess(`Recommendations title: ${title}`);
      return title.trim();
    } catch (error) {
      this.logError('Failed to get recommendations title', error);
      return '';
    }
  }

  async clickViewAll(): Promise<void> {
    this.logStep('Clicking view all button');
    try {
      await this.viewAllButton.click();
      this.logSuccess('View all button clicked');
    } catch (error) {
      this.logError('Failed to click view all button', error);
      throw error;
    }
  }

  async clickNextArrow(): Promise<void> {
    this.logStep('Clicking next arrow');
    try {
      await this.nextArrow.click();
      this.logSuccess('Next arrow clicked');
    } catch (error) {
      this.logError('Failed to click next arrow', error);
      throw error;
    }
  }

  async clickPrevArrow(): Promise<void> {
    this.logStep('Clicking previous arrow');
    try {
      await this.prevArrow.click();
      this.logSuccess('Previous arrow clicked');
    } catch (error) {
      this.logError('Failed to click previous arrow', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ РАБОТЫ С КАРТОЧКАМИ ИГР ============

  async getGameCardByIndex(index: number): Promise<GameInfo | null> {
    this.logStep(`Getting game card at index: ${index}`);
    try {
      const card = this.gameCards.nth(index);
      
      const title = await card.locator(GameSelectors.GAME_TITLE).textContent() || '';
      const provider = await card.locator(GameSelectors.GAME_PROVIDER).textContent() || '';
      const image = await card.locator(GameSelectors.GAME_IMAGE).getAttribute('src') || '';
      const favoriteClass = await card.locator(GameSelectors.FAVORITE_BUTTON).getAttribute('class') || '';
      const isFavorite = favoriteClass.includes('bg-orange');
      const hasPlayButton = await card.locator(GameSelectors.REAL_BUTTON).isVisible();
      const hasDemoButton = await card.locator(GameSelectors.DEMO_BUTTON).isVisible();
      
      const gameInfo: GameInfo = {
        index,
        title: title.trim(),
        provider: provider.trim(),
        image,
        isFavorite,
        hasPlayButton,
        hasDemoButton,
        locator: card,
        type: GameType.SLOT,
        status: GameStatus.LOADED
      };
      
      this.logSuccess(`Game card at index ${index}: ${gameInfo.title}`);
      return gameInfo;
    } catch (error) {
      this.logError(`Failed to get game card at index: ${index}`, error);
      return null;
    }
  }

  async getAllGameCards(): Promise<GameInfo[]> {
    this.logStep('Getting all game cards');
    try {
      const cards: GameInfo[] = [];
      
      const count = await this.getRecommendationsCount();
      for (let i = 0; i < count; i++) {
        const card = await this.getGameCardByIndex(i);
        if (card) {
          cards.push(card);
        }
      }
      
      this.logSuccess(`Found ${cards.length} game cards`);
      return cards;
    } catch (error) {
      this.logError('Failed to get all game cards', error);
      return [];
    }
  }

  async clickGameCardFavorite(index: number): Promise<void> {
    this.logStep(`Clicking favorite button for game card at index: ${index}`);
    try {
      const favoriteButton = this.gameCards.nth(index).locator('button[wire\\:click="toggleFavorite"]');
      await favoriteButton.click();
      this.logSuccess(`Favorite button clicked for game card at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click favorite button for game card at index: ${index}`, error);
      throw error;
    }
  }

  async clickGameCardRealButton(index: number): Promise<void> {
    this.logStep(`Clicking real button for game card at index: ${index}`);
    try {
      const realButton = this.gameCards.nth(index).locator('button[wire\\:click*="startGame(\\"real\\")"]');
      await realButton.click();
      this.logSuccess(`Real button clicked for game card at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click real button for game card at index: ${index}`, error);
      throw error;
    }
  }

  async clickGameCardDemoButton(index: number): Promise<void> {
    this.logStep(`Clicking demo button for game card at index: ${index}`);
    try {
      const demoButton = this.gameCards.nth(index).locator('button[wire\\:click*="startGame(\\"demo\\")"]');
      await demoButton.click();
      this.logSuccess(`Demo button clicked for game card at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click demo button for game card at index: ${index}`, error);
      throw error;
    }
  }

  // ============ МЕТОДЫ ПОИСКА ИГР ============

  async findGameCardByTitle(title: string): Promise<number | null> {
    this.logStep(`Finding game card by title: ${title}`);
    try {
      const count = await this.getRecommendationsCount();
      
      for (let i = 0; i < count; i++) {
        const card = await this.getGameCardByIndex(i);
        if (card && card.title.toLowerCase().includes(title.toLowerCase())) {
          this.logSuccess(`Game card found at index: ${i}`);
          return i;
        }
      }
      
      this.logStep(`Game card not found: ${title}`);
      return null;
    } catch (error) {
      this.logError(`Failed to find game card by title: ${title}`, error);
      return null;
    }
  }

  async findGameCardByProvider(provider: string): Promise<number | null> {
    this.logStep(`Finding game card by provider: ${provider}`);
    try {
      const count = await this.getRecommendationsCount();
      
      for (let i = 0; i < count; i++) {
        const card = await this.getGameCardByIndex(i);
        if (card && card.provider.toLowerCase().includes(provider.toLowerCase())) {
          this.logSuccess(`Game card found at index: ${i}`);
          return i;
        }
      }
      
      this.logStep(`Game card not found for provider: ${provider}`);
      return null;
    } catch (error) {
      this.logError(`Failed to find game card by provider: ${provider}`, error);
      return null;
    }
  }

  // ============ МЕТОДЫ ПРОВЕРКИ СОСТОЯНИЯ ============

  async isGamePageLoaded(): Promise<boolean> {
    this.logStep('Checking if game page is loaded');
    try {
      const isContainerVisible = await this.gameContainer.isVisible();
      const isIframeVisible = await this.isGameIframeVisible();
      
      const isLoaded = isContainerVisible && isIframeVisible;
      this.logStep(`Game page loaded: ${isLoaded}`);
      return isLoaded;
    } catch (error) {
      this.logError('Failed to check if game page is loaded', error);
      return false;
    }
  }

  async waitForGamePageToLoad(): Promise<void> {
    this.logStep('Waiting for game page to load');
    try {
      await this.gameContainer.waitFor({ state: 'visible', timeout: 15000 });
      await this.waitForGameIframeToLoad();
      this.logSuccess('Game page loaded');
    } catch (error) {
      this.logError('Game page did not load in time', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ ВАЛИДАЦИИ ============

  async validateGamePage(): Promise<boolean> {
    this.logStep('Validating game page');
    try {
      const isLoaded = await this.isGamePageLoaded();
      const hasBreadcrumbs = await this.breadcrumbs.isVisible();
      const hasControlPanel = await this.controlPanel.isVisible();
      const hasRecommendations = await this.recommendationsSection.isVisible();
      
      const isValid = isLoaded && hasBreadcrumbs && hasControlPanel && hasRecommendations;
      
      if (isValid) {
        this.logSuccess('Game page validation passed');
      } else {
        this.logError('Game page validation failed');
      }
      
      return isValid;
    } catch (error) {
      this.logError('Failed to validate game page', error);
      return false;
    }
  }

  // ============ УТИЛИТЫ ============

  async scrollToRecommendations(): Promise<void> {
    this.logStep('Scrolling to recommendations section');
    try {
      await this.recommendationsSection.scrollIntoViewIfNeeded();
      this.logSuccess('Scrolled to recommendations section');
    } catch (error) {
      this.logError('Failed to scroll to recommendations section', error);
      throw error;
    }
  }

  async takeGamePageScreenshot(name?: string): Promise<Buffer> {
    this.logStep('Taking game page screenshot');
    try {
      const screenshotName = name || `game-page-${Date.now()}`;
      const screenshot = await this.rootElement.screenshot({
        path: `screenshots/${screenshotName}.png`
      });
      this.logSuccess(`Game page screenshot taken: ${screenshotName}`);
      return screenshot;
    } catch (error) {
      this.logError('Failed to take game page screenshot', error);
      throw error;
    }
  }
}
