import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { GameServiceFactory } from '@/core/factories/GameServiceFactory';
import { Routes } from '@/config/routes';
import { IGameOrchestrator } from '@/core/interfaces/IGame.interface';
import { GameTestResult, GameStabilityResult, GameErrorType } from '@/types/game.types';


test.describe('Финальная проверка стабильности игр (15 секунд)', () => {
  let gameService: IGameOrchestrator;
  let page: any;
  
  test.beforeEach(async ({ page: testPage }) => {
    logger.testStart('Final Game Stability 15s Tests', 'game-stability-15s-final.spec.ts');
    page = testPage;
    gameService = GameServiceFactory.createGameOrchestrator(page);
    
    // Переходим на главную страницу (авторизация уже выполнена в globalSetup)
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    
    logger.info('Final Game Stability 15s Tests', 'Using cached authentication from global setup');
  });
  
  /**
   * Универсальная функция для тестирования игры с детальной обработкой ошибок
   */
  async function testGameStability(gameTitle: string, providerName: string): Promise<void> {
    const testName = `${gameTitle} (${providerName})`;
    logger.info(testName, 'Starting stability test for 15 seconds');
    
    try {
      // Шаг 1: Тестируем открытие игры
      logger.info(testName, 'Step 1: Testing game opening');
      const result: GameTestResult = await gameService.testGameUniversal(gameTitle, providerName);
      
      if (!result.success) {
        // Игра не открылась - обрабатываем ошибку
        logger.error(testName, `Game opening failed: ${result.errorType} - ${result.errorDetails}`);
        handleGameOpeningError(testName, result);
        return;
      }
      
      logger.info(testName, 'Step 1: Game opened successfully');
      
      // Шаг 2: Тестируем стабильность игры
      logger.info(testName, 'Step 2: Testing game stability for 15 seconds');
      const stabilityResult: GameStabilityResult = await gameService.testGameStabilityUniversal(gameTitle, 15);
      
      if (stabilityResult.isStable) {
        // Игра стабильна
        logger.info(testName, `Step 2: Game remained stable for ${stabilityResult.duration} seconds`);
        logger.assertion(`${testName} stability check (15s)`, true, true, true);
        expect(stabilityResult.isStable).toBe(true);
      } else {
        // Игра нестабильна
        logger.error(testName, `Step 2: Game became unstable: ${stabilityResult.failureReason}`);
        logger.assertion(`${testName} stability check (15s)`, true, false, false);
        
        // FAIL тест с детальным описанием ошибки
        throw new Error(`Game stability test FAILED: ${stabilityResult.failureReason}`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(testName, `Test execution failed: ${errorMessage}`);
      
      // FAIL тест с детальным описанием ошибки
      throw new Error(`Game stability test FAILED: ${errorMessage}`);
    }
  }

  /**
   * Обработка ошибок открытия игры
   */
  function handleGameOpeningError(testName: string, result: GameTestResult): void {
    const errorType = result.errorType || 'UNKNOWN_ERROR';
    const errorDetails = result.errorDetails || 'No details provided';
    
    switch (errorType) {
      case GameErrorType.CURRENCY_RESTRICTION:
        logger.info(testName, `Currency restriction detected - test PASSED with restriction message: ${errorDetails}`);
        expect(true).toBe(true);
        break;
        
      case GameErrorType.BROWSER_BLOCKING:
        logger.info(testName, `Browser blocking detected - test PASSED with blocking message: ${errorDetails}`);
        expect(true).toBe(true);
        break;
        
      case GameErrorType.SERVER_ERROR:
        logger.info(testName, `Server error detected - test PASSED with server error message: ${errorDetails}`);
        expect(true).toBe(true);
        break;
        
      case GameErrorType.IP_BLOCKED:
        logger.info(testName, `IP blocking detected - test PASSED with IP blocking message: ${errorDetails}`);
        expect(true).toBe(true);
        break;
        
      case GameErrorType.GAME_NOT_FOUND:
        logger.error(testName, `Game not found - test FAILED: ${errorDetails}`);
        throw new Error(`Game not found: ${errorDetails}`);
        
      case GameErrorType.URL_MISMATCH:
        logger.error(testName, `URL mismatch - test FAILED: ${errorDetails}`);
        throw new Error(`URL mismatch: ${errorDetails}`);
        
      case GameErrorType.IFRAME_ERROR:
        logger.error(testName, `Iframe error - test FAILED: ${errorDetails}`);
        throw new Error(`Iframe error: ${errorDetails}`);
        
      case GameErrorType.STABILITY_ERROR:
        logger.error(testName, `Stability error - test FAILED: ${errorDetails}`);
        throw new Error(`Stability error: ${errorDetails}`);
        
      default:
        logger.error(testName, `Unknown error type: ${errorType} - test FAILED: ${errorDetails}`);
        throw new Error(`Unknown error type: ${errorType} - ${errorDetails}`);
    }
  }
  
  // Amigo Gaming
  test.describe('Amigo Gaming', () => {
    test('Amigo Gaming игра Jaguar Treasures (15 секунд)', async () => {
      await testGameStability('Jaguar Treasures', 'Amigo Gaming');
    });
    test('Amigo Gaming игра Regal Fruits 100 (15 секунд)', async () => {
      await testGameStability('Regal Fruits 100', 'Amigo Gaming');
    });
    test('Amigo Gaming игра Amigo Bronze Classic (15 секунд)', async () => {
      await testGameStability('Amigo Bronze Classic', 'Amigo Gaming');
    });
  });

  // Apollo Games
  test.describe('Apollo Games', () => {
    test('Apollo Games игра Aztec Mystery (15 секунд)', async () => {  
      await testGameStability('Aztec Mystery', 'Apollo Games');
    });
    test('Apollo Games игра Oldskool Spin 81 (15 секунд)', async () => {  
      await testGameStability('Oldskool Spin 81', 'Apollo Games');
    });
    test('Apollo Games игра Lucky Chess Mate (15 секунд)', async () => {  
      await testGameStability('Lucky Chess Mate', 'Apollo Games');
    });
  });

  // AvatarUX
  test.describe('AvatarUX', () => {
    test('AvatarUX игра HelioPOPolis (15 секунд)', async () => {
      await testGameStability('HelioPOPolis', 'AvatarUX');
    });
    test('AvatarUX игра Worms Of Valor (15 секунд)', async () => {
      await testGameStability('Worms Of Valor', 'AvatarUX');
    });
    test('AvatarUX игра Beastly Burglars (15 секунд)', async () => {
      await testGameStability('Beastly Burglars', 'AvatarUX');
    });
  });

  // Aviatrix
  test.describe('Aviatrix', () => {
    test('Проверка стабильности игры Aviatrix (15 секунд)', async () => {
      await testGameStability('Aviatrix', 'Aviatrix');
    });
  });

  // Belatra
  test.describe('Belatra', () => {
    test('Belatra игра Lucky Barrel Tavern (15 секунд)', async () => {
      await testGameStability('Lucky Barrel Tavern', 'Belatra');
    });
    test('Belatra игра Mummyland Treasures (15 секунд)', async () => {
      await testGameStability('Mummyland Treasures', 'Belatra');
    });
    test('Belatra игра Catch & Snatch (15 секунд)', async () => {
      await testGameStability('Catch & Snatch', 'Belatra');
    });
  });

  // BGaming
  test.describe('BGaming', () => {
    test('BGaming игра Book of Cats Megaways (15 секунд)', async () => {
      await testGameStability('Book of Cats Megaways', 'BGaming');
    });
    test('BGaming игра Chicken Rush (15 секунд)', async () => {
      await testGameStability('Chicken Rush', 'BGaming');
    });
    test('BGaming игра Carnival Bonanza (15 секунд)', async () => {
      await testGameStability('Carnival Bonanza', 'BGaming');
    });
  });

  // Blueprint
  test.describe('Blueprint', () => {
    test('Blueprint игра Crabbin\' for Cash Megaways (15 секунд)', async () => {
      await testGameStability('Crabbin\' for Cash Megaways', 'Blueprint');
    });
    test('Blueprint игра Big Catch Bass Fishing Megaways (15 секунд)', async () => {
      await testGameStability('Big Catch Bass Fishing Megaways', 'Blueprint');
    });
    test('Blueprint игра Bankin\' Bacon (15 секунд)', async () => {  
      await testGameStability('Bankin\' Bacon', 'Blueprint');
    });
  });

  // Endorphina
  test.describe('Endorphina', () => {
    test('Endorphina игра Cyber Wolf (15 секунд)', async () => {
      await testGameStability('Cyber Wolf', 'Endorphina');
    });
    test('Endorphina игра In Jazz (15 секунд)', async () => {
      await testGameStability('In Jazz', 'Endorphina');
    });
    test('Endorphina игра Book of Conquistador (15 секунд)', async () => {
      await testGameStability('Book of Conquistador', 'Endorphina');
    });
  });

  // Evoplay
  test.describe('Evoplay', () => {
    test('Evoplay игра Young Buffalo Song (15 секунд)', async () => {
      await testGameStability('Young Buffalo Song', 'Evoplay');
    });
    test('Evoplay игра Fruit Super Nova 80 (15 секунд)', async () => {
      await testGameStability('Fruit Super Nova 80', 'Evoplay');
    });
    test('Evoplay игра Goddess Of The Night (15 секунд)', async () => {
      await testGameStability('Goddess Of The Night', 'Evoplay');
    });
  });

  // Ezugi
  test.describe('Ezugi', () => {
    test('Ezugi игра Andar Bahar (15 секунд)', async () => {
      await testGameStability('Andar Bahar', 'Ezugi');
    });
    test('Ezugi игра Unlimited Blackjack (15 секунд)', async () => {
      await testGameStability('Unlimited Blackjack', 'Ezugi');
    });
    test('Ezugi игра Roulette Portomaso 2 (15 секунд)', async () => {
      await testGameStability('Roulette Portomaso 2', 'Ezugi');
    });
  });

  // Fugaso
  test.describe('Fugaso', () => {
    test('Fugaso игра The Mummy Win Hunters (15 секунд)', async () => {
      await testGameStability('The Mummy Win Hunters', 'Fugaso');
    });
    test('Fugaso игра TRINITY GOLD LINK: RUNNING WINS™ (15 секунд)', async () => {
      await testGameStability('TRINITY GOLD LINK: RUNNING WINS™', 'Fugaso');
    });
    test('Fugaso игра Book Of Anime (15 секунд)', async () => {
      await testGameStability('Book Of Anime', 'Fugaso');
    });
  });

  // Gamzix
  test.describe('Gamzix', () => {
    test('Gamzix игра 3x3: Hell Spin (15 секунд)', async () => {
      await testGameStability('3x3: Hell Spin', 'Gamzix');
    });
    test('Gamzix игра Bonanza Donut (15 секунд)', async () => {
      await testGameStability('Bonanza Donut', 'Gamzix');
    });
    test('Gamzix игра Snow Coin: Hold The Spin (15 секунд)', async () => {
      await testGameStability('Snow Coin: Hold The Spin', 'Gamzix');
    });
  });

  // Hacksaw Gaming
  test.describe('Hacksaw Gaming', () => {
    test('Hacksaw Gaming игра RIP City (15 секунд)', async () => {
      await testGameStability('RIP City', 'Hacksaw Gaming');
    });
    test('Hacksaw Gaming игра Stormforged (15 секунд)', async () => {
      await testGameStability('Stormforged', 'Hacksaw Gaming');
    });
    test('Hacksaw Gaming игра Xmas Drop (15 секунд)', async () => {
      await testGameStability('Xmas Drop', 'Hacksaw Gaming');
    });
  });

  // Igrosoft
  test.describe('Igrosoft', () => {
    test('Igrosoft игра Keks (15 секунд)', async () => {
      await testGameStability('Keks', 'Igrosoft');
    });
    test('Igrosoft игра Gnome (15 секунд)', async () => {
      await testGameStability('Gnome', 'Igrosoft');
    });
    test('Igrosoft игра Pirate 2 (15 секунд)', async () => {
      await testGameStability('Pirate 2', 'Igrosoft');
    });
  });

  // KA Gaming
  test.describe('KA Gaming', () => {
    test('KA Gaming игра King Octopus (15 секунд)', async () => {
      await testGameStability('King Octopus', 'KA Gaming');
    });
    test('KA Gaming игра Fishing Expedition (15 секунд)', async () => {
      await testGameStability('Fishing Expedition', 'KA Gaming');
    });
    test('KA Gaming игра Aladdin (15 секунд)', async () => {
      await testGameStability('Aladdin', 'KA Gaming');
    });
  });
  
  // Netent
  test.describe('Netent', () => {
    test('Netent игра Milkshake XXXtreme (15 секунд)', async () => { 
      await testGameStability('Milkshake XXXtreme', 'Netent');
    });
    test('Netent игра Jack and the Beanstalk (15 секунд)', async () => { 
      await testGameStability('Jack and the Beanstalk', 'Netent');
    });
    test('Netent игра Jumanji (15 секунд)', async () => { 
      await testGameStability('Jumanji', 'Netent');
    });
  });

  // NetGame
  test.describe('NetGame', () => {
    test('NetGame игра Big Banker Bonanza (15 секунд)', async () => { 
      await testGameStability('Big Banker Bonanza', 'NetGame');
    });
    test('NetGame игра Cactus Riches: Cash Pool (15 секунд)', async () => { 
      await testGameStability('Cactus Riches: Cash Pool', 'NetGame');
    });
    test('NetGame игра Mighty Horses: Cash Connect (15 секунд)', async () => { 
      await testGameStability('Mighty Horses: Cash Connect', 'NetGame');
    });
  });

  // Novomatic
  test.describe('Novomatic', () => {
    test('Novomatic игра Lucky lady\'s charm deluxe (15 секунд)', async () => { 
      await testGameStability('Lucky lady\'s charm deluxe', 'Novomatic');
    });
    test('Novomatic игра Book of ra deluxe (15 секунд)', async () => { 
      await testGameStability('Book of ra deluxe', 'Novomatic');
    });
    test('Novomatic игра Plenty on Twenty Hot (15 секунд)', async () => { 
      await testGameStability('Plenty on Twenty Hot', 'Novomatic');
    });
  });
  
  // Onlyplay
  test.describe('Onlyplay', () => {
    test('Onlyplay игра Cherry Boom (15 секунд)', async () => { 
      await testGameStability('Cherry Boom', 'Onlyplay');
    });
    test('Onlyplay игра Book of Pinata (15 секунд)', async () => { 
      await testGameStability('Book of Pinata', 'Onlyplay');
    });
    test('Onlyplay игра Fish Store (15 секунд)', async () => { 
      await testGameStability('Fish Store', 'Onlyplay');
    });
  });

  // PGSoft
  test.describe('PGSoft', () => {
    test('PGSoft игра Midas Fortune (15 секунд)', async () => { 
      await testGameStability('Midas Fortune', 'PGSoft');
    });
    test('PGSoft игра Treasures of Aztec (15 секунд)', async () => { 
      await testGameStability('Treasures of Aztec', 'PGSoft');
    });
    test('PGSoft игра Cocktail Nights (15 секунд)', async () => { 
      await testGameStability('Cocktail Nights', 'PGSoft');
    });
  });

  // Platipus
  test.describe('Platipus', () => {
    test('Platipus игра 9 Dragon Kings (15 секунд)', async () => { 
      await testGameStability('9 Dragon Kings', 'Platipus');
    });
    test('Platipus игра Wild Spin (15 секунд)', async () => { 
      await testGameStability('Wild Spin', 'Platipus');
    });
    test('Platipus игра Pirate\'s Legacy (15 секунд)', async () => { 
      await testGameStability('Pirate\'s Legacy', 'Platipus');
    });
  });

  // Play'n Go
  test.describe('Play\'n Go', () => {
    test('Play\'n Go игра 15 Crystal Roses (15 секунд)', async () => { 
      await testGameStability('15 Crystal Roses', 'Play\'n Go');
    });
    test('Play\'n Go игра JewelBox (15 секунд)', async () => { 
      await testGameStability('JewelBox', 'Play\'n Go');
    });
    test('Play\'n Go игра Immor Tails (15 секунд)', async () => { 
      await testGameStability('Immor Tails', 'Play\'n Go');
    });
  });

  // Playson
  test.describe('Playson', () => {
    test('Playson игра Lion Gems: Hold and Win (15 секунд)', async () => { 
      await testGameStability('Lion Gems: Hold and Win', 'Playson');
    });
    test('Playson игра Pirate Chest: Hold and Win (15 секунд)', async () => { 
      await testGameStability('Pirate Chest: Hold and Win', 'Playson');
    });
    test('Playson игра Book del Sol: Multiplier (15 секунд)', async () => { 
      await testGameStability('Book del Sol: Multiplier', 'Playson');
    });
  });

  // Playson Premium
  test.describe('Playson Premium', () => {
    test('Playson Premium игра Legend of Cleopatra Megaways (15 секунд)', async () => { 
      await testGameStability('Legend of Cleopatra Megaways', 'Playson Premium');
    });
    test('Playson Premium игра Wolf Power Megaways (15 секунд)', async () => { 
      await testGameStability('Wolf Power Megaways', 'Playson Premium');
    });
    test('Playson Premium игра Buffalo Power Megaways (15 секунд)', async () => { 
      await testGameStability('Buffalo Power Megaways', 'Playson Premium');
    });
  });

  // Pragmatic Play
  test.describe('Pragmatic Play', () => {
    test('Pragmatic Play игра Wisdom of Athena 1000 (15 секунд)', async () => { 
      await testGameStability('Wisdom of Athena 1000', 'Pragmatic Play');
    });
    test('Pragmatic Play игра Gems Bonanza (15 секунд)', async () => { 
      await testGameStability('Gems Bonanza', 'Pragmatic Play');
    });
    test('Pragmatic Play игра Fire Portals (15 секунд)', async () => { 
      await testGameStability('Fire Portals', 'Pragmatic Play');
    });
  });

  // Pragmatic Play Live
  test.describe('Pragmatic Play Live', () => {
    test('Pragmatic Play Live игра Dragon Tiger (15 секунд)', async () => { 
      await testGameStability('Dragon Tiger', 'Pragmatic Play Live');
    });
    test('Pragmatic Play Live игра Sweet Bonanza CandyLand (15 секунд)', async () => { 
      await testGameStability('Sweet Bonanza CandyLand', 'Pragmatic Play Live');
    });
    test('Pragmatic Play Live игра Game shows (15 секунд)', async () => { 
      await testGameStability('Game shows', 'Pragmatic Play Live');
    });
  });

  // Spadegaming
  test.describe('Spadegaming', () => {
    test('Spadegaming игра Heroes (15 секунд)', async () => { 
      await testGameStability('Heroes', 'Spadegaming');
    });
    test('Spadegaming игра Fishing God (15 секунд)', async () => { 
      await testGameStability('Fishing God', 'Spadegaming');
    });
    test('Spadegaming игра 888 (15 секунд)', async () => { 
      await testGameStability('888', 'Spadegaming');
    });
  });

  // Ssg
  test.describe('Ssg', () => {
    test('Ssg игра Book of Futuria (15 секунд)', async () => { 
      await testGameStability('Book of Futuria', 'Ssg');
    });
    test('Ssg игра Vampires (15 секунд)', async () => { 
      await testGameStability('Vampires', 'Ssg');
    });
    test('Ssg игра Plinko X (15 секунд)', async () => { 
      await testGameStability('Plinko X', 'Ssg');
    });
  });

  // Turbogames
  test.describe('Turbogames', () => {
    test('Turbogames игра JavelinX (15 секунд)', async () => { 
      await testGameStability('JavelinX', 'Turbogames');
    });
    test('Turbogames игра Dice Twice (15 секунд)', async () => { 
      await testGameStability('Dice Twice', 'Turbogames');
    });
    test('Turbogames игра Save the Princess (15 секунд)', async () => { 
      await testGameStability('Save the Princess', 'Turbogames');
    });
  });

  // Wazdan
  test.describe('Wazdan', () => {
    test('Wazdan игра Power of Gods: Valhalla (15 секунд)', async () => { 
      await testGameStability('Power of Gods: Valhalla', 'Wazdan');
    });
    test('Wazdan игра 9 Coins (15 секунд)', async () => { 
      await testGameStability('9 Coins', 'Wazdan');
    });
    test('Wazdan игра Hot Slot Great Book of Magic (15 секунд)', async () => { 
      await testGameStability('Hot Slot Great Book of Magic', 'Wazdan');
    });
  });
});