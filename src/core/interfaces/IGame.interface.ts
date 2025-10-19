/**
 * IGame Interface - Упрощенные интерфейсы для игровых сервисов
 * Применяет принцип ISP - разделение интерфейсов по ответственности
 */

import { GameTestResult, GameStabilityResult, GameInfo } from '@/types/game.types';

/**
 * Интерфейс для обнаружения игр
 */
export interface IGameDetection {
  getAllGamesWithIndexes(): Promise<GameInfo[]>;
  getGamesCount(): Promise<number>;
  getGameByIndex(index: number): Promise<GameInfo | null>;
  findGameByTitle(title: string, provider?: string): Promise<GameInfo | null>;
  waitForGamesToLoad(): Promise<void>;
}

/**
 * Интерфейс для взаимодействия с играми
 */
export interface IGameInteraction {
  clickGameByIndex(index: number): Promise<void>;
  clickPlayButtonByIndex(index: number): Promise<void>;
  clickDemoButtonByIndex(index: number): Promise<void>;
  openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult>;
  closeGameIframe(): Promise<void>;
  waitForGameToLoad(gameInfo: GameInfo): Promise<boolean>;
}

/**
 * Интерфейс для валидации игр
 */
export interface IGameValidation {
  validateGameElements(): Promise<boolean>;
  validateGameUrl(expectedUrl: string): Promise<boolean>;
  validateIframe(iframeSelector: string): Promise<boolean>;
  validateCanvas(canvasSelector: string): Promise<boolean>;
  checkGameErrors(): Promise<boolean>;
  monitorGameStability(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult>;
}

/**
 * Основной интерфейс оркестратора игр
 */
export interface IGameOrchestrator {
  // Основные методы тестирования
  testGameUniversal(gameTitle: string, providerName: string): Promise<GameTestResult>;
  testGameStabilityUniversal(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult>;
  
  // Методы обнаружения игр
  getAllGamesWithIndexes(): Promise<GameInfo[]>;
  getGamesCount(): Promise<number>;
  getGameByIndex(index: number): Promise<GameInfo | null>;
  
  // Методы взаимодействия
  clickGameByIndex(index: number): Promise<void>;
  clickPlayButtonByIndex(index: number): Promise<void>;
  clickDemoButtonByIndex(index: number): Promise<void>;
  
  // Методы валидации
  validateGameUrl(url: string): Promise<boolean>;
  checkGameElements(): Promise<boolean>;
  
  // Утилиты
  waitForGamesToLoad(): Promise<void>;
  closeGameIframe(): Promise<void>;
}