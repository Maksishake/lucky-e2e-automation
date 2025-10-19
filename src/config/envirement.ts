/**
 * Environment Configuration
 * Конфигурация окружения для тестов
 */
import 'dotenv/config';

export class Environment {

  // Базовые настройки
  static readonly BaseURL = process.env.BASE_URL || 'https://luckycoin777.live';
  static readonly TestTimeout = parseInt(process.env.TEST_TIMEOUT || '120000');
  static readonly ActionTimeout = parseInt(process.env.ACTION_TIMEOUT || '15000');
  
  // Настройки авторизации
  public static get UserEmail(): string {
    return process.env.E2E_USER_EMAIL || 'justshmv@gmail.com';
  }
  public static get UserPassword(): string {
    return process.env.E2E_USER_PASSWORD || '12345678';
  }
  
  // Настройки геолокации
  static readonly DefaultLatitude = 50.4501;
  static readonly DefaultLongitude = 30.5234;
  static readonly DefaultLocale = 'uk-UA';
  static readonly DefaultTimezone = 'Europe/Kiev';
  
  // Настройки браузера
  static readonly ViewportWidth = 1920;
  static readonly ViewportHeight = 1080;
  static readonly Headless = process.env.HEADLESS !== 'false';
  
  // Настройки отчетов
  static readonly ReportPath = process.env.REPORT_PATH || 'test-results';
  static readonly ScreenshotPath = process.env.SCREENSHOT_PATH || 'screenshots';
  
  // Настройки параллельности
  static readonly Workers = parseInt(process.env.WORKERS || '1');
  static readonly Retries = parseInt(process.env.RETRIES || '2');
}
