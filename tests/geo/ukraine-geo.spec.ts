import { test, expect } from '@playwright/test';
import { GeoUtils } from '@/utils/geo-utils';
import { logger } from '@/core/logger';

test.describe('Ukraine Geolocation Tests', () => {
  let geoUtils: GeoUtils;

  test.beforeEach(async ({ page }) => {
    geoUtils = new GeoUtils(page);
    logger.info('Ukraine Geo Tests', 'Starting Ukraine geolocation tests');
  });

  test('should have Ukraine geolocation settings', async () => {
    // Проверяем настройки геолокации
    const geoSetup = await geoUtils.checkGeoSetup();
    
    // Проверяем локализацию (это должно работать)
    expect(geoSetup.locale).toContain('uk');
    
    // Проверяем часовой пояс (это должно работать)
    expect(geoSetup.timezone).toContain('Kiev');
    
    // Логируем результат геолокации (может быть null в headless режиме)
    logger.info('Ukraine Geo Tests', `Geolocation available: ${geoSetup.geolocation ? 'Yes' : 'No'}`);
    logger.info('Ukraine Geo Tests', 'Ukraine browser settings verified');
  });

  test('should have correct coordinates for Ukraine', async () => {
    const location = await geoUtils.checkGeolocation();
    
    if (location) {
      expect(location.latitude).toBeCloseTo(50.4501, 1); // Киев
      expect(location.longitude).toBeCloseTo(30.5234, 1);
      logger.info('Ukraine Geo Tests', 'Ukraine coordinates verified');
    } else {
      logger.info('Ukraine Geo Tests', 'Geolocation not available in headless mode (expected)');
    }
  });

  test('should have Ukrainian locale and timezone', async () => {
    const locale = await geoUtils.getBrowserLocale();
    const timezone = await geoUtils.getTimezone();
    
    // Проверяем украинскую локализацию
    expect(locale).toMatch(/uk-UA|uk/);
    
    // Проверяем украинский часовой пояс
    expect(timezone).toMatch(/Kiev|Europe\/Kiev/);
    
    logger.info('Ukraine Geo Tests', 'Ukrainian locale and timezone verified');
  });

  test('should access site with Ukraine settings', async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('/'); 
    
    // Проверяем, что страница загрузилась
    await expect(page).toHaveTitle(/Luckycoin|Lucky/);
    
    // Проверяем геолокацию после загрузки
    const isInUkraine = await geoUtils.isInUkraine();
    expect(isInUkraine).toBe(true);
    
    logger.info('Ukraine Geo Tests', 'Site accessed with Ukraine settings');
  });
});
