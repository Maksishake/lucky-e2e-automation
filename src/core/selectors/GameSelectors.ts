/**
 * Game Selectors - Централизованные селекторы для игровых элементов
 * Устраняет дублирование селекторов между сервисами и компонентами
 */

export class GameSelectors {
  // ============ ОСНОВНЫЕ СЕЛЕКТОРЫ ИГР ============
  
  static readonly GAME_CARDS = '.game-card, .card-game, [data-testid="game-card"]';
  static readonly GAME_TITLE = '.title, .game-title, [data-testid="game-title"]';
  static readonly GAME_PROVIDER = '.provider, .game-provider, [data-testid="game-provider"]';
  static readonly GAME_IMAGE = 'img, .game-image, [data-testid="game-image"]';
  
  // ============ КНОПКИ ИГР ============
  
  static readonly PLAY_BUTTON = '.btn-play, .play-button, [data-testid="play-button"]';
  static readonly DEMO_BUTTON = '.btn-demo, .demo-button, [data-testid="demo-button"]';
  static readonly FAVORITE_BUTTON = '.btn-favorite, .favorite-button, [data-testid="favorite-button"]';
  static readonly REAL_BUTTON = '.btn-default, .real-button, [data-testid="real-button"]';
  
  // ============ IFRAME И CANVAS ============
  
  static readonly GAME_IFRAME = 'iframe[src*="game"], iframe[src*="play"], iframe.game-iframe, #fullscreen-container iframe';
  static readonly CANVAS = 'canvas';
  static readonly CANVAS_WRAPPER = '#__canvas_wrapper__ canvas, div[id*="canvas"] canvas';
  static readonly GAME_CONTAINER = '#fullscreen-container, .game-container';
  
  // ============ СЕЛЕКТОРЫ ОШИБОК ============
  
  static readonly ERROR_SELECTORS = [
    '.error-message',
    '.game-error',
    '[data-testid="error"]',
    '#sub-frame-error',
    '.blocked-message',
    '#main-frame-error',
    '.interstitial-wrapper',
    '.neterror',
    '#main-content',
    '#main-message',
    '.error-code',
    '#sub-frame-error-details'
  ];
  
  // ============ СЕЛЕКТОРЫ СТАБИЛЬНОСТИ ============
  
  static readonly STABILITY_INDICATORS = [
    'div[class*="game"]',
    'div[class*="canvas"]',
    'div[class*="container"]',
    'div[class*="wrapper"]',
    'div[id*="game"]',
    'div[id*="canvas"]',
    '#game-holder',
    '#hud-canvas',
    'canvas[id*="hud"]',
    'canvas[id*="game"]'
  ];
  
  // ============ СЕЛЕКТОРЫ ЗАКРЫТИЯ ============
  
  static readonly CLOSE_BUTTONS = [
    '.close-iframe',
    '.close-game',
    '[data-testid="close-game"]',
    'button[wire\\:click="closeGame"]'
  ];
  
  // ============ СЕЛЕКТОРЫ ФИЛЬТРОВ ============
  
  static readonly CATEGORY_LIST = '.game-categories-list, .categories, [data-testid="categories"]';
  static readonly CATEGORY_ITEMS = '.category-item, .category, [data-testid="category-item"]';
  static readonly PROVIDER_DROPDOWN = '.provider-dropdown, .providers, [data-testid="providers"]';
  static readonly PROVIDER_ITEMS = '.provider-item, .provider, [data-testid="provider-item"]';
  static readonly SEARCH_INPUT = 'input[placeholder*="Поиск"], input[placeholder*="Search"], [data-testid="game-search"]';
  static readonly CLEAR_FILTERS = 'button[type="reset"], .clear-filters, [data-testid="clear-filters"]';
  
  // ============ СЕЛЕКТОРЫ СЕТКИ ============
  
  static readonly GAME_GRID = '.game-grid, .games-container, [data-testid="games-grid"]';
  static readonly LOADING_SPINNER = '.loading, .spinner, [data-testid="loading"]';
  static readonly EMPTY_STATE = '.empty-state, .no-games, [data-testid="empty-state"]';
  
  // ============ СЕЛЕКТОРЫ СТРАНИЦЫ ИГРЫ ============
  
  static readonly BREADCRUMBS = '.breadcrumbs';
  static readonly BREADCRUMB_ITEMS = '.breadcrumbs li';
  static readonly BREADCRUMB_LINKS = '.breadcrumbs a';
  static readonly GAME_MODE_TOGGLE = '#switchs';
  static readonly FULLSCREEN_BUTTON = '#fullscreen';
  static readonly FULLSCREEN_WIDE_BUTTON = '#fullscreen-wide';
  static readonly RECOMMENDATIONS_SECTION = '.row-container';
  static readonly RECOMMENDATIONS_SLIDER = '.splide';
  static readonly SLIDER_ARROWS = '.splide__arrows';
  static readonly NEXT_ARROW = '.splide__arrow--next';
  static readonly PREV_ARROW = '.splide__arrow--prev';
  
  // ============ МОБИЛЬНЫЕ СЕЛЕКТОРЫ ============
  
  static readonly MOBILE_BOTTOM_PANEL = '.fullscreen-mobile-bottom';
  static readonly LOBBY_BUTTON = 'a[href="#"]';
  static readonly MOBILE_CLOSE_BUTTON = '[wire\\:click="closeGame"]';
  
  // ============ УТИЛИТАРНЫЕ МЕТОДЫ ============
  
  static getGameCardByIndex(index: number): string {
    return `${this.GAME_CARDS}:nth-child(${index + 1})`;
  }
  
  static getCategoryByName(name: string): string {
    return `${this.CATEGORY_ITEMS}:has-text("${name}")`;
  }
  
  static getProviderByName(name: string): string {
    return `${this.PROVIDER_ITEMS}:has-text("${name}")`;
  }
  
  static getGameByTitle(title: string): string {
    return `${this.GAME_CARDS}:has-text("${title}")`;
  }
  
  static getActiveCategory(): string {
    return `${this.CATEGORY_ITEMS}.active, ${this.CATEGORY_ITEMS}.selected, ${this.CATEGORY_ITEMS}[data-active="true"]`;
  }
  
  static getActiveProvider(): string {
    return `${this.PROVIDER_DROPDOWN} .selected-provider, ${this.PROVIDER_DROPDOWN} .active-provider, ${this.PROVIDER_DROPDOWN} [data-active="true"]`;
  }
}
