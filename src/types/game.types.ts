/**
 * Game Types - Упрощенные типы для игр
 * Убраны дубликаты и избыточные типы
 */

import { Locator } from '@playwright/test';

// ==================== БАЗОВЫЕ ENUMS ====================

export enum GameButtonType {
  REAL = 'real',
  DEMO = 'demo',
  FAVORITE = 'favorite'
}

export enum GameErrorType {
  IP_BLOCKED = 'IP_BLOCKED',
  CURRENCY_RESTRICTION = 'CURRENCY_RESTRICTION',
  BROWSER_BLOCKING = 'BROWSER_BLOCKING',
  SERVER_ERROR = 'SERVER_ERROR',
  STABILITY_ERROR = 'STABILITY_ERROR',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  URL_MISMATCH = 'URL_MISMATCH',
  IFRAME_ERROR = 'IFRAME_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum GameType {
  SLOT = 'slot',
  LIVE = 'live',
  TABLE = 'table',
  SPORTS = 'sports'
}

export enum GameStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
  BLOCKED = 'blocked'
}

// ==================== ОСНОВНЫЕ ИНТЕРФЕЙСЫ ====================

export interface GameInfo {
  index: number;
  title: string;
  provider: string;
  image?: string;
  hasPlayButton?: boolean;
  hasDemoButton?: boolean;
  isFavorite?: boolean;
  locator?: Locator;
  type?: GameType;
  status?: GameStatus;
}

export interface GameTestResult {
  success: boolean;
  errorType?: GameErrorType;
  errorDetails?: string;
  gameData?: GameInfo;
}

export interface GameStabilityResult {
  isStable: boolean;
  failureReason?: string;
  duration: number;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface ErrorResult {
  hasError: boolean;
  errorType?: GameErrorType;
  errorDetails?: string;
}

// ==================== UI КОМПОНЕНТЫ ====================

export interface GameCategory {
  id: number;
  name: string;
  icon: string;
  count: number;
  isActive: boolean;
}

export interface GameProvider {
  id: number;
  name: string;
  count: number;
  isActive: boolean;
}

export interface Game {
  id: string;
  title: string;
  provider: string;
  imageUrl: string;
  isFavorite: boolean;
  hasDemo: boolean;
  hasReal: boolean;
  category: string;
  gameUrl: string;
  demoUrl?: string;
}

// ==================== СОСТОЯНИЕ ====================

export interface GameFilterState {
  selectedCategory: number;
  selectedProvider: number;
  searchQuery: string;
  showFavorites: boolean;
}

export interface GameGridState {
  games: Game[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
}

// ==================== УТИЛИТАРНЫЕ ТИПЫ ====================

export type GameAction = 'real' | 'demo' | 'favorite';
export type GameSortOrder = 'title' | 'provider' | 'category' | 'favorites';
export type GameFilterType = 'category' | 'provider' | 'search' | 'favorites';

// ==================== ОШИБКИ ====================

export interface GameError {
  type: GameErrorType;
  message: string;
  details?: string;
  timestamp: number;
  gameTitle: string;
  provider?: string;
}

// ==================== ЛОГИРОВАНИЕ ====================

export interface GameLogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  gameTitle?: string;
  provider?: string;
  data?: unknown;
}