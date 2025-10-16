/**
 * Game URL Service - Сервис для работы с URL игр
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class GameUrlService extends BaseService {
  constructor(page: Page) {
    super(page, 'GameUrlService');
  }

  /**
   * Создание URL slug из названия игры с правильной обработкой специальных символов
   */
  createGameSlug(gameTitle: string): string {
    return gameTitle
      .toLowerCase()
      .replace(/['']/g, '') // Убираем апострофы
      .replace(/[:\s]+/g, '-') // Заменяем двоеточия и пробелы на дефисы
      .replace(/[^a-z0-9-]/g, '') // Убираем все остальные не-буквенно-цифровые символы
      .replace(/-+/g, '-') // Убираем множественные дефисы
      .replace(/^-|-$/g, ''); // Убираем дефисы в начале и конце
  }

  /**
   * Проверка соответствия URL игры с учетом провайдеров
   */
  isGameUrlValid(currentUrl: string, gameTitle: string, gameSlug?: string): boolean {
    // Если URL содержит /play/real/, это уже хороший признак
    if (!currentUrl.includes('/play/real/')) {
      return false;
    }

    const slug = gameSlug || this.createGameSlug(gameTitle);
    
    // Проверяем различные варианты URL (с провайдерами и без)
    const urlVariants = [
      slug,
      gameTitle.toLowerCase().replace(/['']/g, '').replace(/[:\s]+/g, '-'),
      gameTitle.toLowerCase().replace(/['']/g, '').replace(/[:\s]+/g, ''),
      gameTitle.toLowerCase().replace(/['']/g, ''),
      // Варианты с провайдерами (провайдер-название-игры)
      `-${slug}`,
      `-${gameTitle.toLowerCase().replace(/['']/g, '').replace(/[:\s]+/g, '-')}`
    ];
    
    return urlVariants.some(variant => 
      variant && variant.length > 0 && currentUrl.includes(variant)
    );
  }

  /**
   * Более гибкая проверка URL игры (fallback)
   */
  isGameUrlValidFlexible(currentUrl: string, gameTitle: string): boolean {
    if (!currentUrl.includes('/play/real/')) {
      return false;
    }

    // Извлекаем название игры из URL (после последнего дефиса)
    const urlParts = currentUrl.split('/');
    const gamePart = urlParts[urlParts.length - 1];
    const gameNameFromUrl = gamePart.split('-').slice(1).join('-'); // Убираем провайдера
    
    const gameSlug = this.createGameSlug(gameTitle);
    
    // Проверяем, содержит ли URL название игры
    return gameNameFromUrl.includes(gameSlug) || 
           gameSlug.includes(gameNameFromUrl) ||
           gameTitle.toLowerCase().replace(/['']/g, '').includes(gameNameFromUrl);
  }

  /**
   * Проверить, что URL содержит /play/real/ и название игры
   */
  async validateGameUrl(gameTitle: string): Promise<{ isValid: boolean; currentUrl: string; errorMessage?: string }> {
    this.logStep(`Validating game URL for: ${gameTitle}`);
    
    try {
      const currentUrl = this.page.url();
      this.logStep(`Current URL: ${currentUrl}`);
      
      // Проверяем, что URL содержит /play/real/
      if (!currentUrl.includes('/play/real/')) {
        return {
          isValid: false,
          currentUrl,
          errorMessage: `Expected URL with /play/real/, got: ${currentUrl}`
        };
      }
      
      // Проверяем, что URL содержит название игры
      const gameSlug = this.createGameSlug(gameTitle);
      const urlContainsGame = this.isGameUrlValid(currentUrl, gameTitle, gameSlug);
      
      if (!urlContainsGame) {
        this.logStep(`URL validation failed. Expected game: ${gameTitle}, URL: ${currentUrl}`);
        // Пробуем еще раз с более гибкой проверкой
        const flexibleCheck = this.isGameUrlValidFlexible(currentUrl, gameTitle);
        if (!flexibleCheck) {
          return {
            isValid: false,
            currentUrl,
            errorMessage: `Game URL does not match expected game. Expected: ${gameTitle}, URL: ${currentUrl}`
          };
        }
      }
      
      this.logSuccess(`Game URL is valid: ${gameTitle}`);
      return { isValid: true, currentUrl };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to validate game URL for ${gameTitle}: ${errorMessage}`);
      return {
        isValid: false,
        currentUrl: this.page.url(),
        errorMessage: `URL validation error: ${errorMessage}`
      };
    }
  }

  /**
   * Дождаться изменения URL на игровой
   */
  async waitForGameUrl(timeout: number = 15000): Promise<boolean> {
    this.logStep('Waiting for game URL to load');
    
    try {
      await this.page.waitForURL('**/play/real/**', { timeout });
      this.logSuccess('Game URL loaded successfully');
      return true;
    } catch (error) {
      this.logStep('Game URL did not change, checking current URL');
      return false;
    }
  }

  /**
   * Получить текущий URL страницы
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Проверить, что мы находимся на главной странице
   */
  isOnHomePage(): boolean {
    const currentUrl = this.page.url();
    return currentUrl.includes('/') && !currentUrl.includes('/play/');
  }

  /**
   * Проверить, что мы находимся на странице игры
   */
  isOnGamePage(): boolean {
    const currentUrl = this.page.url();
    return currentUrl.includes('/play/real/');
  }
}
