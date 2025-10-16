import { chromium } from '@playwright/test';
import { UserService } from '@/services/user/user.service';
import { BitcapitalModalComponent } from '@/components/modals/bitcapital-modal';
import { Environment } from '@config/envirement';
import { logger } from '@/core/logger';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
  logger.info('GlobalSetup', 'Starting global authentication setup');
  
  // Создаем директорию для сохранения состояния
  const storageDir = path.join(__dirname, '../../test-results');
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  
  const storagePath = path.join(storageDir, 'auth-storage.json');
  
  // Проверяем, существует ли уже файл с состоянием
  if (fs.existsSync(storagePath)) {
    logger.info('GlobalSetup', `Authentication state file already exists: ${storagePath}`);
    process.env.AUTH_STORAGE_PATH = storagePath;
    return;
  }
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Выполняем авторизацию
    const userService = new UserService(page);
    const bitcapitalModalComponent = new BitcapitalModalComponent(page);
    
    await userService.authWithEmail(Environment.UserEmail, Environment.UserPassword);
    await bitcapitalModalComponent.close();
    
    // Сохраняем состояние браузера
    const storageState = await context.storageState();
    
    // Сохраняем состояние в файл
    fs.writeFileSync(storagePath, JSON.stringify(storageState, null, 2));
    
    // Устанавливаем переменную окружения для использования в тестах
    process.env.AUTH_STORAGE_PATH = storagePath;
    
    logger.info('GlobalSetup', `Authentication state saved to: ${storagePath}`);
    
  } catch (error) {
    logger.error('GlobalSetup', `Failed to setup authentication: ${error}`);
    
    // Создаем пустой файл состояния в случае ошибки
    const emptyState = { cookies: [], origins: [] };
    fs.writeFileSync(storagePath, JSON.stringify(emptyState, null, 2));
    process.env.AUTH_STORAGE_PATH = storagePath;
    
    logger.warn('GlobalSetup', `Created empty storage state file due to error: ${storagePath}`);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
