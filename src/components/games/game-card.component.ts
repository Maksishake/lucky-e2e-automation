/**
 * Game Card Component - Компонент игровой карточки
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../../core/base.component';
import { Game, GameAction, GameCardHoverState } from '../../types/game.types';

export class GameCardComponent extends BaseComponent {

  constructor(page: Page) {
    super(page, 'GameCard', '.game-card');
  }

  // ============ ОСНОВНЫЕ ЭЛЕМЕНТЫ ============
  get cardSelector() {
    return this.page.locator('.game-card');
  }

  get cardImageSelector() {
    return this.page.locator('.game-card img');
  }

  get cardHoverSelector() {
    return this.page.locator('.game-card-hover');
  }

  get cardTitleSelector() {
    return this.page.locator('.game-card-hover .title');
  }

  get cardSubtitleSelector() {
    return this.page.locator('.game-card-hover .subtitle');
  }

  // ============ КНОПКИ ДЕЙСТВИЙ ============
  get favoriteButtonSelector() {
    return this.page.locator('button[wire\\:click="toggleFavorite"]');
  }

  get realButtonSelector() {
    return this.page.locator('button[wire\\:click="startGame(\\"real\\")"]');
  }

  get demoButtonSelector() {
    return this.page.locator('button[wire\\:click="startGame(\\"demo\\")"]');
  }

  get buttonsContainerSelector() {
    return this.page.locator('.game-card-hover .buttons');
  }
  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  /**
   * Проверить, видна ли карточка
   */
  async isCardVisible(): Promise<boolean> {
    return await this.isVisible();
  }

  /**
   * Навести курсор на карточку
   */
  async hoverCard(): Promise<void> {
    this.logStep('Hovering over game card');
    await this.cardSelector.hover();
    await this.page.waitForTimeout(300);
    this.logSuccess('Hovered over game card');
  }

  /**
   * Убрать курсор с карточки
   */
  async unhoverCard(): Promise<void> {
    this.logStep('Unhovering game card');
    await this.page.hover('body');
    await this.page.waitForTimeout(300);
    this.logSuccess('Unhovered game card');
  }

  // ============ ИНФОРМАЦИЯ ОБ ИГРЕ ============
  /**
   * Получить название игры
   */
  async getGameTitle(): Promise<string> {
    const title = this.cardTitleSelector;
    return await title.textContent() || '';
  }

  /**
   * Получить провайдера игры
   */
  async getGameProvider(): Promise<string> {
    const subtitle = this.cardSubtitleSelector;
    return await subtitle.textContent() || '';
  }

  /**
   * Получить URL изображения игры
   */
  async getGameImageUrl(): Promise<string> {
    const image = this.cardImageSelector;
    return await image.getAttribute('src') || '';
  }

  /**
   * Получить информацию об игре
   */
  async getGameInfo(): Promise<Game> {
    const title = await this.getGameTitle();
    const provider = await this.getGameProvider();
    const imageUrl = await this.getGameImageUrl();
    const isFavorite = await this.isFavorite();
    const hasDemo = await this.hasDemoButton();
    const hasReal = await this.hasRealButton();

    return {
      id: `game-${title.toLowerCase().replace(/\s+/g, '-')}`,
      title,
      provider,
      imageUrl,
      isFavorite,
      hasDemo,
      hasReal,
      category: '',
      gameUrl: '',
      demoUrl: ''
    };
  }

  // ============ ВЗАИМОДЕЙСТВИЕ С КАРТОЧКОЙ ============
  /**
   * Кликнуть по карточке игры
   */
  async clickCard(): Promise<void> {
    this.logStep('Clicking game card');
    await this.cardSelector.click();
    this.logSuccess('Clicked game card');
  }

  /**
   * Кликнуть по изображению игры
   */
  async clickGameImage(): Promise<void> {
    this.logStep('Clicking game image');
    await this.cardImageSelector.click();
    this.logSuccess('Clicked game image');
  }

  // ============ ИЗБРАННОЕ ============
  /**
   * Переключить избранное
   */
  async toggleFavorite(): Promise<void> {
    this.logStep('Toggling favorite');
    await this.favoriteButtonSelector.click();
    await this.page.waitForTimeout(500);
    this.logSuccess('Toggled favorite');
  }

  /**
   * Проверить, добавлена ли игра в избранное
   */
  async isFavorite(): Promise<boolean> {
    const favoriteButton = this.favoriteButtonSelector;
    const classes = await favoriteButton.getAttribute('class');
    return classes?.includes('bg-orange') || false;
  }

  // ============ ЗАПУСК ИГР ============
  /**
   * Запустить игру в реальном режиме
   */
  async startRealGame(): Promise<void> {
    this.logStep('Starting real game');
    await this.realButtonSelector.click();
    await this.page.waitForTimeout(1000);
    this.logSuccess('Started real game');
  }

  /**
   * Запустить игру в демо режиме
   */
  async startDemoGame(): Promise<void> {
    this.logStep('Starting demo game');
    await this.demoButtonSelector.click();
    await this.page.waitForTimeout(1000);
    this.logSuccess('Started demo game');
  }

  /**
   * Запустить игру с указанным действием
   */
  async startGame(action: GameAction): Promise<void> {
    if (action === 'real') {
      await this.startRealGame();
    } else if (action === 'demo') {
      await this.startDemoGame();
    }
  }

  // ============ ПРОВЕРКИ КНОПОК ============
  /**
   * Проверить, есть ли кнопка "Реальный"
   */
  async hasRealButton(): Promise<boolean> {
    const realButton = this.realButtonSelector;
    return await realButton.isVisible();
  }

  /**
   * Проверить, есть ли кнопка "Демо"
   */
  async hasDemoButton(): Promise<boolean> {
    const demoButton = this.demoButtonSelector;
    return await demoButton.isVisible();
  }

  /**
   * Проверить, видна ли область с кнопками
   */
  async isButtonsContainerVisible(): Promise<boolean> {
    const buttonsContainer = this.buttonsContainerSelector;
    return await buttonsContainer.isVisible();
  }

  /**
   * Проверить, видна ли область при наведении
   */
  async isHoverAreaVisible(): Promise<boolean> {
    const hoverArea = this.cardHoverSelector;
    return await hoverArea.isVisible();
  }

  /**
   * Получить состояние наведения
   */
  async getHoverState(): Promise<GameCardHoverState> {
    const isHovered = await this.isHoverAreaVisible();
    const showButtons = await this.isButtonsContainerVisible();
    const showFavorite = await this.favoriteButtonSelector.isVisible();

    return {
      isHovered,
      showButtons,
      showFavorite
    };
  }

  // ============ ЗАГРУЗКА И СОСТОЯНИЕ ============
  /**
   * Дождаться загрузки карточки
   */
  async waitForCardLoad(): Promise<void> {
    this.logStep('Waiting for game card to load');
    await this.cardSelector.waitFor({ state: 'visible' });
    await this.cardImageSelector.waitFor({ state: 'visible' });
    this.logSuccess('Game card loaded');
  }

  /**
   * Проверить, загружено ли изображение
   */
  async isImageLoaded(): Promise<boolean> {
    const image = this.cardImageSelector;
    const isVisible = await image.isVisible();
    const src = await image.getAttribute('src');
    return isVisible && !!src;
  }

  /**
   * Получить все доступные действия для игры
   */
  async getAvailableActions(): Promise<GameAction[]> {
    const actions: GameAction[] = [];
    
    if (await this.hasRealButton()) {
      actions.push('real');
    }
    
    if (await this.hasDemoButton()) {
      actions.push('demo');
    }
    
    actions.push('favorite');
    
    return actions;
  }

  /**
   * Проверить, активна ли карточка
   */
  async isCardActive(): Promise<boolean> {
    const card = this.cardSelector;
    const classes = await card.getAttribute('class');
    return classes?.includes('active') || false;
  }

  /**
   * Получить CSS классы карточки
   */
  async getCardClasses(): Promise<string[]> {
    const card = this.cardSelector;
    const classString = await card.getAttribute('class') || '';
    return classString.split(' ').filter(cls => cls.length > 0);
  }
}
