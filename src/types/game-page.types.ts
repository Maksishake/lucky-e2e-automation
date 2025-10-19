/**
 * Game Page Types - Типы для работы со страницей игры
 */

// GameCardInfo удален - используйте GameInfo из game.types.ts

export interface BreadcrumbInfo {
  text: string;
  href?: string;
  isActive: boolean;
}

export interface GamePageState {
  isLoaded: boolean;
  isRealMode: boolean;
  isFullscreen: boolean;
  isMobile: boolean;
  recommendationsCount: number;
  breadcrumbsCount: number;
}

export interface GamePageValidation {
  hasGameContainer: boolean;
  hasGameIframe: boolean;
  hasBreadcrumbs: boolean;
  hasControlPanel: boolean;
  hasRecommendations: boolean;
  isValid: boolean;
}

export interface GamePageActions {
  toggleGameMode(): Promise<void>;
  setRealMode(): Promise<void>;
  setDemoMode(): Promise<void>;
  clickFullscreen(): Promise<void>;
  clickFullscreenWide(): Promise<void>;
  toggleFavorite(): Promise<void>;
  closeGame(): Promise<void>;
  clickLobbyButton(): Promise<void>;
  clickViewAll(): Promise<void>;
  clickNextArrow(): Promise<void>;
  clickPrevArrow(): Promise<void>;
}

export interface GamePageNavigation {
  clickBreadcrumb(index: number): Promise<void>;
  getBreadcrumbs(): Promise<string[]>;
  getBreadcrumbText(index: number): Promise<string>;
}

export interface GamePageRecommendations {
  getRecommendationsCount(): Promise<number>;
  getRecommendationTitle(): Promise<string>;
  getAllGameCards(): Promise<GameCardInfo[]>;
  getGameCardByIndex(index: number): Promise<GameCardInfo | null>;
  findGameCardByTitle(title: string): Promise<number | null>;
  findGameCardByProvider(provider: string): Promise<number | null>;
  clickGameCardFavorite(index: number): Promise<void>;
  clickGameCardRealButton(index: number): Promise<void>;
  clickGameCardDemoButton(index: number): Promise<void>;
}

export interface GamePageIframe {
  isGameIframeVisible(): Promise<boolean>;
  getGameIframeSrc(): Promise<string>;
  waitForGameIframeToLoad(): Promise<void>;
}

export interface GamePageValidationMethods {
  isGamePageLoaded(): Promise<boolean>;
  waitForGamePageToLoad(): Promise<void>;
  validateGamePage(): Promise<boolean>;
}

export interface GamePageUtilities {
  scrollToRecommendations(): Promise<void>;
  takeGamePageScreenshot(name?: string): Promise<Buffer>;
}
