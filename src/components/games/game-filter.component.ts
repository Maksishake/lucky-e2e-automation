/**
 * Game Filter Component - Компонент фильтрации игр
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../../core/base.component';
import { GameFilterState, FilterDropdownState } from '../../types/game.types';

export class GameFilterComponent extends BaseComponent {

  constructor(page: Page) {
    super(page, 'GameFilter');
  }

  // ============ ОСНОВНЫЕ ЭЛЕМЕНТЫ ============
  get filterContainer(): Locator {
    return this.page.locator('.filter-container-wrapper');
  }
  
  get searchButton(): Locator {
    return this.page.locator('.search-toggle');
  }
  
  get tabsContainer(): Locator {
    return this.page.locator('.tabs');
  }
  
  get tabItem(): Locator {
    return this.page.locator('.tab-item');
  }
  
  get activeTab(): Locator {
    return this.page.locator('.tab-item.active');
  }

  // ============ КАТЕГОРИИ ============
  get categoriesDropdown(): Locator {
    return this.page.locator('.form-dropdown-button');
  }
  
  get categoriesToggle(): Locator {
    return this.page.locator('[wire\\:click="toggleCategories"]');
  }
  
  get categoriesOptions(): Locator {
    return this.page.locator('.form-select-options');
  }
  
  get categoryItem(): Locator {
    return this.page.locator('li[wire\\:click="setCategory"]');
  }
  
  get activeCategory(): Locator {
    return this.page.locator('li.active');
  }

  get categoriesDropdownButton(): Locator {
    return this.page.locator('.form-group-container[wire\\:click="toggleCategories"]');
  }

  get categoriesDropdownList(): Locator {
    return this.page.locator('.form-group.form-dropdown.form-dropdown-button.open .form-select-dropdown .form-select-options');
  }

  get categoryOption(): Locator {
    return this.page.locator('li[wire\\:click^="setCategory"]');
  }

  get activeCategoryOption(): Locator {
    return this.page.locator('li[wire\\:click^="setCategory"].active');
  }

  // ============ ПРОВАЙДЕРЫ ============
  get providersDropdown(): Locator {
    return this.page.locator('.form-dropdown:not(.form-dropdown-button)');
  }
  
  get providersToggle(): Locator {
    return this.page.locator('[wire\\:click="toggleProviders"]');
  }
  
  get providersOptions(): Locator {
    return this.page.locator('.form-select-options');
  }
  
  get providerItem(): Locator {
    return this.page.locator('li[wire\\:click="setProvider"]');
  }
  
  get activeProvider(): Locator {
    return this.page.locator('li.active');
  }

  get providersDropdownButton(): Locator {
    return this.page.locator('.form-group-container[wire\\:click="toggleProviders"]');
  }

  get providersDropdownList(): Locator {
    return this.page.locator('.form-group-container[wire\\:click="toggleProviders"] + .form-select-dropdown .form-select-options');
  }

  get providerOption(): Locator {
    return this.page.locator('li[wire\\:click^="setProvider"]');
  }

  get activeProviderOption(): Locator {
    return this.page.locator('li[wire\\:click^="setProvider"].active');
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  /**
   * Проверить, виден ли фильтр
   */
  async isFilterVisible(): Promise<boolean> {
    return await this.isVisible();
  }

  // ============ РАБОТА С КАТЕГОРИЯМИ ============
  /**
   * Выбрать категорию по ID
   */
  async selectCategory(categoryId: number): Promise<void> {
    this.logStep(`Selecting category ${categoryId}`);
    await this.openCategoriesDropdown();
    const categoryItem = this.page.locator(`li[wire\\:click="setCategory(${categoryId})"]`);
    await categoryItem.click();
    await this.page.waitForTimeout(500);
    this.logSuccess(`Selected category ${categoryId}`);
  }

  /**
   * Получить активную категорию
   */
  async getActiveCategory(): Promise<number> {
    try {
      // Проверяем, есть ли активная категория в выпадающем списке
      if (await this.activeCategory.isVisible()) {
        const wireClick = await this.activeCategory.getAttribute('wire:click');
        if (wireClick && wireClick.includes('setCategory(')) {
          const match = wireClick.match(/setCategory\((\d+)\)/);
          if (match && match[1]) {
            this.logSuccess(`Found active category: ${match[1]}`);
            return parseInt(match[1]);
          }
        }
      }
      
      // Если в выпадающем списке нет активной категории, проверяем табы
      if (await this.activeTab.isVisible()) {
        const wireClick = await this.activeTab.getAttribute('wire:click');
        if (wireClick && wireClick.includes('setCategory(')) {
          const match = wireClick.match(/setCategory\((\d+)\)/);
          if (match && match[1]) {
            this.logSuccess(`Found active category in tabs: ${match[1]}`);
            return parseInt(match[1]);
          }
        }
      }
      
      this.logStep('No active category found, returning 0 (All categories)');
      return 0;
    } catch (error) {
      this.logError(`Error getting active category: ${error}`);
      return 0;
    }
  }

  // ============ РАБОТА С ПРОВАЙДЕРАМИ ============
  /**
   * Выбрать провайдера по ID
   */
  async selectProvider(providerId: number): Promise<void> {
    this.logStep(`Selecting provider ${providerId}`);
    await this.openProvidersDropdown();
    const providerItem = this.page.locator(`li[wire\\:click="setProvider(${providerId})"]`);
    await providerItem.click();
    await this.page.waitForTimeout(500);
    this.logSuccess(`Selected provider ${providerId}`);
  }

  /**
   * Получить активного провайдера
   */
  async getActiveProvider(): Promise<number> {
    try {
      // Проверяем, есть ли активный провайдер в выпадающем списке
      if (await this.activeProvider.isVisible()) {
        const wireClick = await this.activeProvider.getAttribute('wire:click');
        if (wireClick && wireClick.includes('setProvider(')) {
          const match = wireClick.match(/setProvider\((\d+)\)/);
          if (match && match[1]) {
            this.logSuccess(`Found active provider: ${match[1]}`);
            return parseInt(match[1]);
          }
        }
      }
      
      // Дополнительная проверка через селектор провайдеров
      const providerItems = await this.providerItem.count();
      for (let i = 0; i < providerItems; i++) {
        const item = this.providerItem.nth(i);
        if (await item.isVisible()) {
          const classes = await item.getAttribute('class');
          if (classes && classes.includes('active')) {
            const wireClick = await item.getAttribute('wire:click');
            if (wireClick && wireClick.includes('setProvider(')) {
              const match = wireClick.match(/setProvider\((\d+)\)/);
              if (match && match[1]) {
                this.logSuccess(`Found active provider in list: ${match[1]}`);
                return parseInt(match[1]);
              }
            }
          }
        }
      }
      
      this.logStep('No active provider found, returning 0 (All providers)');
      return 0;
    } catch (error) {
      this.logError(`Error getting active provider: ${error}`);
      return 0;
    }
  }

  

  // ============ ПОИСК И ТАБЫ ============
  /**
   * Открыть поиск
   */
  async openSearch(): Promise<void> {
    this.logStep('Opening search');
    await this.searchButton.click();
    this.logSuccess('Search opened');
  }

  /**
   * Выбрать категорию через табы
   */
  async selectCategoryByTab(categoryId: number): Promise<void> {
    this.logStep(`Selecting category ${categoryId} via tabs`);
    const tabItem = this.page.locator(`.tab-item[wire\\:click="setCategory(${categoryId})"]`);
    await tabItem.click();
    await this.page.waitForTimeout(500);
    this.logSuccess(`Selected category ${categoryId} via tabs`);
  }

  /**
   * Получить активную вкладку
   */
  async getActiveTab(): Promise<number> {
    try {
      // Проверяем, есть ли активная вкладка
      if (await this.activeTab.isVisible()) {
        const wireClick = await this.activeTab.getAttribute('wire:click');
        if (wireClick && wireClick.includes('setCategory(')) {
          const match = wireClick.match(/setCategory\((\d+)\)/);
          if (match && match[1]) {
            this.logSuccess(`Found active tab: ${match[1]}`);
            return parseInt(match[1]);
          }
        }
      }
      
      // Дополнительная проверка через все вкладки
      const tabItems = await this.tabItem.count();
      for (let i = 0; i < tabItems; i++) {
        const item = this.tabItem.nth(i);
        if (await item.isVisible()) {
          const classes = await item.getAttribute('class');
          if (classes && classes.includes('active')) {
            const wireClick = await item.getAttribute('wire:click');
            if (wireClick && wireClick.includes('setCategory(')) {
              const match = wireClick.match(/setCategory\((\d+)\)/);
              if (match && match[1]) {
                this.logSuccess(`Found active tab in list: ${match[1]}`);
                return parseInt(match[1]);
              }
            }
          }
        }
      }
      
      this.logStep('No active tab found, returning 0 (All categories)');
      return 0;
    } catch (error) {
      this.logError(`Error getting active tab: ${error}`);
      return 0;
    }
  }

  // ============ СОСТОЯНИЕ И СБРОС ============
  /**
   * Получить состояние фильтра
   */
  async getFilterState(): Promise<GameFilterState> {
    const selectedCategory = await this.getActiveCategory();
    const selectedProvider = await this.getActiveProvider();
    
    return {
      selectedCategory,
      selectedProvider,
      searchQuery: '',
      showFavorites: false
    };
  }

  /**
   * Получить состояние выпадающих списков
   */
  async getDropdownState(): Promise<FilterDropdownState> {
    return {
      isCategoriesOpen: await this.categoriesOptions.isVisible(),
      isProvidersOpen: await this.providersOptions.isVisible(),
      isSearchOpen: await this.searchButton.isVisible()
    };
  }

  /**
   * Сбросить все фильтры
   */
  async resetFilters(): Promise<void> {
    this.logStep('Resetting all filters');
    await this.selectCategory(0); // Все категории
    await this.selectProvider(0); // Все провайдеры
    this.logSuccess('All filters reset');
  }

  // ============ ПРОВЕРКИ ВЫПАДАЮЩИХ СПИСКОВ ============
  /**
   * Проверить, открыт ли выпадающий список категорий
   */
  async isCategoriesDropdownOpen(): Promise<boolean> {
    return await this.categoriesOptions.isVisible();
  }

  /**
   * Проверить, открыт ли выпадающий список провайдеров
   */
  async isProvidersDropdownOpen(): Promise<boolean> {
    return await this.providersOptions.first().isVisible();
  }

  // ============ РАСШИРЕННЫЕ МЕТОДЫ ДЛЯ ПРОВАЙДЕРОВ ============

  /**
   * Открыть выпадающий список провайдеров
   */
  async openProvidersDropdown(): Promise<void> {
    this.logStep('Opening providers dropdown');
    await this.providersDropdownButton.first().click();
    await this.providersDropdownList.first().waitFor({ state: 'visible', timeout: 3000 });
    this.logSuccess('Providers dropdown opened');
  }

  /**
   * Закрыть выпадающий список провайдеров
   */
  async closeProvidersDropdown(): Promise<void> {
    this.logStep('Closing providers dropdown');
    await this.providersDropdownButton.click();
    await this.providersDropdownList.first().waitFor({ state: 'hidden', timeout: 3000 });
    this.logSuccess('Providers dropdown closed');
  }

  /**
   * Выбрать провайдера по названию
   */
  async selectProviderByName(providerName: string): Promise<void> {
    this.logStep(`Selecting provider: ${providerName}`);
    
    // Открываем выпадающий список, если он закрыт
    if (!(await this.isProvidersDropdownOpen())) {
      await this.openProvidersDropdown();
    }
    
    // Ищем провайдера по названию
    const providerOption = this.providerOption.filter({ hasText: providerName }).first();
    await providerOption.waitFor({ state: 'visible', timeout: 3000 });
    await providerOption.click();
    
    // Ждем закрытия выпадающего списка
    await this.providersDropdownList.first().waitFor({ state: 'hidden', timeout: 3000 });
    
    this.logSuccess(`Provider selected: ${providerName}`);
  }

  /**
   * Выбрать провайдера по ID
   */
  async selectProviderById(providerId: number): Promise<void> {
    this.logStep(`Selecting provider by ID: ${providerId}`);
    
    // Открываем выпадающий список, если он закрыт
    if (!(await this.isProvidersDropdownOpen())) {
      await this.openProvidersDropdown();
    }
    
    // Ищем провайдера по ID в атрибуте wire:click
    const providerOption = this.providerOption.filter({ 
      has: this.page.locator(`[wire:click="setProvider(${providerId})"]`) 
    }).first();
    
    await providerOption.waitFor({ state: 'visible', timeout: 3000 });
    await providerOption.click();
    
    // Ждем закрытия выпадающего списка
    await this.providersDropdownList.first().waitFor({ state: 'hidden', timeout: 3000 });
    
    this.logSuccess(`Provider selected by ID: ${providerId}`);
  }

  /**
   * Получить список всех доступных провайдеров
   */
  async getAvailableProviders(): Promise<string[]> {
    this.logStep('Getting available providers');
    
    // Открываем выпадающий список, если он закрыт
    if (!(await this.isProvidersDropdownOpen())) {
      await this.openProvidersDropdown();
    }
    
    const providers: string[] = [];
    const providerCount = await this.providerOption.count();
    
    for (let i = 0; i < providerCount; i++) {
      const providerElement = this.providerOption.nth(i);
      const providerText = await providerElement.textContent();
      if (providerText) {
        // Извлекаем название провайдера из span с title
        const titleSpan = providerElement.locator('span[title]');
        if (await titleSpan.count() > 0) {
          const title = await titleSpan.getAttribute('title');
          if (title) {
            providers.push(title);
          }
        } else {
          // Если нет title, берем текст без "All" и числа
          const cleanText = providerText.replace(/\d+/g, '').trim();
          if (cleanText && cleanText !== 'All') {
            providers.push(cleanText);
          }
        }
      }
    }
    
    this.logSuccess(`Found ${providers.length} providers`);
    return providers;
  }

  /**
   * Получить активного провайдера
   */
  async getActiveProviderName(): Promise<string> {
    this.logStep('Getting active provider name');
    
    try {
      const activeProvider = this.activeProviderOption.first();
      await activeProvider.waitFor({ state: 'visible', timeout: 2000 });
      
      const providerText = await activeProvider.textContent();
      if (providerText) {
        // Извлекаем название из span с title
        const titleSpan = activeProvider.locator('span[title]');
        if (await titleSpan.count() > 0) {
          const title = await titleSpan.getAttribute('title');
          if (title) {
            this.logSuccess(`Active provider: ${title}`);
            return title;
          }
        }
        
        // Если нет title, берем текст без числа
        const cleanText = providerText.replace(/\d+/g, '').trim();
        this.logSuccess(`Active provider: ${cleanText}`);
        return cleanText;
      }
      
      return 'All';
    } catch (error) {
      this.logError('Failed to get active provider name');
      return 'All';
    }
  }

  // ============ РАСШИРЕННЫЕ МЕТОДЫ ДЛЯ КАТЕГОРИЙ ============

  /**
   * Открыть выпадающий список категорий
   */
  async openCategoriesDropdown(): Promise<void> {
    this.logStep('Opening categories dropdown');
    await this.categoriesDropdownButton.click();
    await this.categoriesDropdownList.waitFor({ state: 'visible', timeout: 3000 });
    this.logSuccess('Categories dropdown opened');
  }

  /**
   * Закрыть выпадающий список категорий
   */
  async closeCategoriesDropdown(): Promise<void> {
    this.logStep('Closing categories dropdown');
    await this.categoriesDropdownButton.click();
    await this.categoriesDropdownList.waitFor({ state: 'hidden', timeout: 3000 });
    this.logSuccess('Categories dropdown closed');
  }

  /**
   * Выбрать категорию по названию
   */
  async selectCategoryByName(categoryName: string): Promise<void> {
    this.logStep(`Selecting category: ${categoryName}`);
    
    // Открываем выпадающий список, если он закрыт
    if (!(await this.isCategoriesDropdownOpen())) {
      await this.openCategoriesDropdown();
    }
    
    // Ищем категорию по названию
    const categoryOption = this.categoryOption.filter({ hasText: categoryName }).first();
    await categoryOption.waitFor({ state: 'visible', timeout: 3000 });
    await categoryOption.click();
    
    // Ждем закрытия выпадающего списка
    await this.categoriesDropdownList.waitFor({ state: 'hidden', timeout: 3000 });
    
    this.logSuccess(`Category selected: ${categoryName}`);
  }

  /**
   * Выбрать категорию по ID
   */
  async selectCategoryById(categoryId: number): Promise<void> {
    this.logStep(`Selecting category by ID: ${categoryId}`);
    
    // Открываем выпадающий список, если он закрыт
    if (!(await this.isCategoriesDropdownOpen())) {
      await this.openCategoriesDropdown();
    }
    
    // Ищем категорию по ID в атрибуте wire:click
    const categoryOption = this.categoryOption.filter({ 
      has: this.page.locator(`[wire:click="setCategory(${categoryId})"]`) 
    }).first();
    
    await categoryOption.waitFor({ state: 'visible', timeout: 3000 });
    await categoryOption.click();
    
    // Ждем закрытия выпадающего списка
    await this.categoriesDropdownList.waitFor({ state: 'hidden', timeout: 3000 });
    
    this.logSuccess(`Category selected by ID: ${categoryId}`);
  }

  /**
   * Получить список всех доступных категорий
   */
  async getAvailableCategories(): Promise<string[]> {
    this.logStep('Getting available categories');
    
    // Открываем выпадающий список, если он закрыт
    if (!(await this.isCategoriesDropdownOpen())) {
      await this.openCategoriesDropdown();
    }
    
    const categories: string[] = [];
    const categoryCount = await this.categoryOption.count();
    
    for (let i = 0; i < categoryCount; i++) {
      const categoryElement = this.categoryOption.nth(i);
      const categoryText = await categoryElement.textContent();
      if (categoryText) {
        // Извлекаем название категории из span
        const categorySpan = categoryElement.locator('span').last();
        if (await categorySpan.count() > 0) {
          const categoryName = await categorySpan.textContent();
          if (categoryName) {
            categories.push(categoryName.trim());
          }
        } else {
          // Если нет span, берем текст без "Усі" и числа
          const cleanText = categoryText.replace(/\d+/g, '').replace('Усі', '').trim();
          if (cleanText) {
            categories.push(cleanText);
          }
        }
      }
    }
    
    this.logSuccess(`Found ${categories.length} categories`);
    return categories;
  }

  /**
   * Получить активную категорию
   */
  async getActiveCategoryName(): Promise<string> {
    this.logStep('Getting active category name');
    
    try {
      const activeCategory = this.activeCategoryOption.first();
      await activeCategory.waitFor({ state: 'visible', timeout: 2000 });
      
      const categoryText = await activeCategory.textContent();
      if (categoryText) {
        // Извлекаем название из span
        const categorySpan = activeCategory.locator('span').last();
        if (await categorySpan.count() > 0) {
          const categoryName = await categorySpan.textContent();
          if (categoryName) {
            this.logSuccess(`Active category: ${categoryName.trim()}`);
            return categoryName.trim();
          }
        }
        
        // Если нет span, берем текст без числа
        const cleanText = categoryText.replace(/\d+/g, '').replace('Усі', '').trim();
        this.logSuccess(`Active category: ${cleanText}`);
        return cleanText || 'Усі';
      }
      
      return 'Усі';
    } catch (error) {
      this.logError('Failed to get active category name');
      return 'Усі';
    }
  }

  // ============ УНИВЕРСАЛЬНЫЕ МЕТОДЫ ============

  /**
   * Применить фильтры по провайдеру и категории
   */
  async applyFilters(providerName?: string, categoryName?: string): Promise<void> {
    this.logStep('Applying filters');
    
    if (providerName) {
      await this.selectProviderByName(providerName);
    }
    
    if (categoryName) {
      await this.selectCategoryByName(categoryName);
    }
    
    // Ждем обновления списка игр
    await this.page.waitForTimeout(2000);
    
    this.logSuccess('Filters applied');
  }

  /**
   * Проверить, что фильтры применены корректно
   */
  async verifyFiltersApplied(expectedProvider?: string, expectedCategory?: string): Promise<boolean> {
    this.logStep('Verifying filters applied');
    
    let providerMatch = true;
    let categoryMatch = true;
    
    if (expectedProvider) {
      const activeProvider = await this.getActiveProviderName();
      providerMatch = activeProvider === expectedProvider;
    }
    
    if (expectedCategory) {
      const activeCategory = await this.getActiveCategoryName();
      categoryMatch = activeCategory === expectedCategory;
    }
    
    const allMatch = providerMatch && categoryMatch;
    this.logSuccess(`Filters verification: ${allMatch ? 'PASSED' : 'FAILED'}`);
    
    return allMatch;
  }
}
