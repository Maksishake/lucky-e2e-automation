/**
 * Game Constants - Централизованные константы для игровых сервисов
 * Устраняет дублирование констант между сервисами
 */

export class GameConstants {
  // ============ ТАЙМАУТЫ ============
  
  static readonly TIMEOUTS = {
    DEFAULT: 10000,
    GAME_LOAD: 15000,
    STABILITY_CHECK: 2000,
    IFRAME_WAIT: 5000,
    CANVAS_WAIT: 1000,
    ERROR_CHECK: 5000,
    GRID_LOAD: 10000,
    CARD_LOAD: 5000
  };
  
  // ============ URL ПАТТЕРНЫ ============
  
  static readonly URL_PATTERNS = {
    GAME_PLAY: '/play/real/',
    GAME_DEMO: '/play/demo/',
    HOME: '/',
    CATEGORY: '/category/',
    PROVIDER: '/provider/'
  };
  
  // ============ ТИПЫ ОШИБОК ============
  
  static readonly ERROR_TYPES = {
    IP_BLOCKED: 'IP_BLOCKED',
    CURRENCY_RESTRICTION: 'CURRENCY_RESTRICTION',
    SERVER_ERROR: 'SERVER_ERROR',
    BROWSER_BLOCKING: 'BROWSER_BLOCKING',
    STABILITY_ERROR: 'STABILITY_ERROR',
    GAME_NOT_FOUND: 'GAME_NOT_FOUND',
    URL_MISMATCH: 'URL_MISMATCH',
    IFRAME_ERROR: 'IFRAME_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  };
  
  // ============ ИНДИКАТОРЫ ОШИБОК ============
  
  static readonly ERROR_INDICATORS = {
    IP_BLOCKED: [
      'Your IP location is not allowed',
      'Sorry, Your IP location is not allowed',
      'IP location is not allowed',
      'Access denied',
      'Forbidden',
      '403'
    ],
    CURRENCY_RESTRICTION: [
      'Currency restriction',
      'We cannot offer games in detected currency',
      'Please contact customer support',
      'incorrect-currency-for-geo-location',
      'error.incorrectCurrencyGeoLocation'
    ],
    SERVER_ERROR: [
      'HTTP Status 500',
      'Internal Server Error',
      'Request processing failed',
      'Launch game error',
      'Game not found',
      'Exception Report',
      'Root Cause'
    ],
    BROWSER_BLOCKING: [
      'ERR_BLOCKED_BY_RESPONSE',
      'Сайт заблокирован',
      'не позволяет установить соединение',
      'interstitial-wrapper',
      'main-frame-error',
      'sub-frame-error',
      'neterror',
      'error-code'
    ]
  };
  
  // ============ ЛИМИТЫ ============
  
  static readonly LIMITS = {
    MAX_GAMES: 20,
    MAX_RETRIES: 3,
    MAX_STABILITY_CHECKS: 10,
    MAX_CANVAS_SELECTORS: 15,
    MAX_ERROR_SELECTORS: 12
  };
  
  // ============ СЕЛЕКТОРЫ CANVAS ============
  
  static readonly CANVAS_SELECTORS = [
    'canvas',
    'canvas[width]',
    'canvas[height]',
    'canvas:not([width="0"])',
    'canvas:not([height="0"])',
    '#__canvas_wrapper__ canvas',
    'div[id*="canvas"] canvas',
    'div[class*="canvas"] canvas',
    '#hud-canvas',
    'canvas[id*="hud"]',
    'canvas[id*="game"]',
    '#game-holder canvas',
    'div[id="root"] canvas',
    'div[id="app-content"] canvas',
    'div[class*="app"] canvas'
  ];
  
  // ============ СЕЛЕКТОРЫ ИНДИКАТОРОВ ИГР ============
  
  static readonly GAME_INDICATORS = [
    '#__canvas_wrapper__',
    'div[id*="canvas"]',
    'div[class*="canvas"]',
    'div[id*="game"]',
    'div[class*="game"]',
    'div[id*="app"]',
    'div[class*="app"]',
    'div[id="root"]',
    'div[id="app-content"]',
    '#game-holder',
    '#hud-canvas',
    'canvas[id*="hud"]',
    'canvas[id*="game"]'
  ];
  
  // ============ СТАТУСЫ ИГР ============
  
  static readonly GAME_STATUS = {
    LOADING: 'loading',
    LOADED: 'loaded',
    ERROR: 'error',
    BLOCKED: 'blocked'
  };
  
  // ============ ТИПЫ ИГР ============
  
  static readonly GAME_TYPES = {
    SLOT: 'slot',
    LIVE: 'live',
    TABLE: 'table',
    SPORTS: 'sports'
  };
  
  // ============ ТИПЫ КНОПОК ============
  
  static readonly BUTTON_TYPES = {
    REAL: 'real',
    DEMO: 'demo',
    FAVORITE: 'favorite'
  };
  
  // ============ УТИЛИТАРНЫЕ МЕТОДЫ ============
  
  static createGameSlug(gameTitle: string): string {
    return gameTitle
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[:\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  static isErrorType(type: string): boolean {
    return Object.values(this.ERROR_TYPES).includes(type as any);
  }
  
  static getErrorIndicators(type: string): string[] {
    return this.ERROR_INDICATORS[type as keyof typeof this.ERROR_INDICATORS] || [];
  }
}
