/**
 * Geo Utils - Утилиты для работы с геолокацией
 */

import { Page } from '@playwright/test';
import { logger } from '@/core/logger';

export class GeoUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Проверка геолокации в браузере
   */
  async checkGeolocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const result = await this.page.evaluate(() => {
        return new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
          if (!navigator.geolocation) {
            resolve(null);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.log('Geolocation error:', error);
              resolve(null);
            },
            { timeout: 5000 }
          );
        });
      });

      if (result) {
        logger.info('GeoUtils', `Current location: ${result.latitude}, ${result.longitude}`);
      } else {
        logger.warn('GeoUtils', 'Geolocation not available or denied');
      }

      return result;
    } catch (error) {
      logger.error('GeoUtils', `Error checking geolocation: ${error}`);
      return null;
    }
  }

  /**
   * Проверка, что мы находимся в Украине
   */
  async isInUkraine(): Promise<boolean> {
    const location = await this.checkGeolocation();
    if (!location) return false;

    // Примерные координаты Украины
    const ukraineBounds = {
      north: 52.5,
      south: 44.0,
      east: 40.0,
      west: 22.0
    };

    const isInUkraine = 
      location.latitude >= ukraineBounds.south && 
      location.latitude <= ukraineBounds.north &&
      location.longitude >= ukraineBounds.west && 
      location.longitude <= ukraineBounds.east;

    logger.info('GeoUtils', `Location is in Ukraine: ${isInUkraine}`);
    return isInUkraine;
  }

  /**
   * Получение информации о локали браузера
   */
  async getBrowserLocale(): Promise<string> {
    const locale = await this.page.evaluate(() => navigator.language);
    logger.info('GeoUtils', `Browser locale: ${locale}`);
    return locale;
  }

  /**
   * Получение информации о часовом поясе
   */
  async getTimezone(): Promise<string> {
    const timezone = await this.page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
    logger.info('GeoUtils', `Browser timezone: ${timezone}`);
    return timezone;
  }

  /**
   * Проверка всех настроек геолокации
   */
  async checkGeoSetup(): Promise<{
    geolocation: { latitude: number; longitude: number } | null;
    isInUkraine: boolean;
    locale: string;
    timezone: string;
  }> {
    logger.info('GeoUtils', 'Checking geo setup...');

    const [geolocation, isInUkraine, locale, timezone] = await Promise.all([
      this.checkGeolocation(),
      this.isInUkraine(),
      this.getBrowserLocale(),
      this.getTimezone()
    ]);

    const result = {
      geolocation,
      isInUkraine,
      locale,
      timezone
    };

    logger.info('GeoUtils', 'Geo setup check completed:', result);
    return result;
  }
}
