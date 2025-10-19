/**
 * Game Services Test - Тест игровых сервисов
 */

import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { GameServiceFactory } from '@/core/factories/GameServiceFactory';
import { GameDetectionService } from '@/services/game/game-detection.service';
import { GameInteractionService } from '@/services/game/game-interaction.service';
import { GameValidationService } from '@/services/game/game-validation.service';
import { GameOrchestrator } from '@/services/game/GameOrchestrator';

test.describe('Игровые сервисы', () => {
  test('Проверка создания GameDetectionService', async ({ page }) => {
    logger.testStart('Game Services Test', 'game-services-test.spec.ts');
    
    const detectionService = GameServiceFactory.createGameDetectionService(page);
    expect(detectionService).toBeDefined();
    expect(typeof detectionService.getAllGamesWithIndexes).toBe('function');
    expect(typeof detectionService.getGamesCount).toBe('function');
    expect(typeof detectionService.findGameByTitle).toBe('function');
    
    logger.assertion('GameDetectionService created successfully', true, true, true);
  });
  
  test('Проверка создания GameInteractionService', async ({ page }) => {
    logger.testStart('Game Services Test', 'game-services-test.spec.ts');
    
    const interactionService = GameServiceFactory.createGameInteractionService(page);
    expect(interactionService).toBeDefined();
    expect(typeof interactionService.clickGameByIndex).toBe('function');
    expect(typeof interactionService.openGame).toBe('function');
    expect(typeof interactionService.closeGameIframe).toBe('function');
    
    logger.assertion('GameInteractionService created successfully', true, true, true);
  });
  
  test('Проверка создания GameValidationService', async ({ page }) => {
    logger.testStart('Game Services Test', 'game-services-test.spec.ts');
    
    const validationService = GameServiceFactory.createGameValidationService(page);
    expect(validationService).toBeDefined();
    expect(typeof validationService.validateGameUrl).toBe('function');
    expect(typeof validationService.validateIframe).toBe('function');
    expect(typeof validationService.monitorGameStability).toBe('function');
    
    logger.assertion('GameValidationService created successfully', true, true, true);
  });
  
  test('Проверка создания GameOrchestrator', async ({ page }) => {
    logger.testStart('Game Services Test', 'game-services-test.spec.ts');
    
    const orchestrator = GameServiceFactory.createGameOrchestrator(page);
    expect(orchestrator).toBeDefined();
    expect(typeof orchestrator.testGameUniversal).toBe('function');
    expect(typeof orchestrator.testGameStabilityUniversal).toBe('function');
    expect(typeof orchestrator.getAllGamesWithIndexes).toBe('function');
    
    logger.assertion('GameOrchestrator created successfully', true, true, true);
  });
  
  test('Проверка создания сервисов напрямую', async ({ page }) => {
    logger.testStart('Game Services Test', 'game-services-test.spec.ts');
    
    const detectionService = new GameDetectionService(page);
    const interactionService = new GameInteractionService(page);
    const validationService = new GameValidationService(page);
    
    expect(detectionService).toBeDefined();
    expect(interactionService).toBeDefined();
    expect(validationService).toBeDefined();
    
    logger.assertion('All services created directly', true, true, true);
  });
  
  test('Проверка создания GameOrchestrator с сервисами', async ({ page }) => {
    logger.testStart('Game Services Test', 'game-services-test.spec.ts');
    
    const detectionService = new GameDetectionService(page);
    const interactionService = new GameInteractionService(page);
    const validationService = new GameValidationService(page);
    
    const orchestrator = new GameOrchestrator(page, detectionService, interactionService, validationService);
    expect(orchestrator).toBeDefined();
    expect(typeof orchestrator.testGameUniversal).toBe('function');
    
    logger.assertion('GameOrchestrator with services created successfully', true, true, true);
  });
});
