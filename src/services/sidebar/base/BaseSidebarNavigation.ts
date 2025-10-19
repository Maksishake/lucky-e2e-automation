/**
 * Base abstract class for Sidebar Navigation
 * Базовый абстрактный класс для навигации по сайдбару
 */

import { Page } from '@playwright/test';
import { BaseSidebarService } from './BaseSidebarService';
import { ISidebarNavigation } from '../interfaces/ISidebarNavigation';
import { SidebarOperationResult, SidebarItemConfig, SidebarItemType } from '../types/sidebar.types';

/**
 * Базовый абстрактный класс для навигации по сайдбару
 * Применяет принцип SRP - только навигация
 */
export abstract class BaseSidebarNavigation extends BaseSidebarService implements ISidebarNavigation {
  constructor(page: Page, serviceName: string) {
    super(page, serviceName);
  }

  // ==================== ABSTRACT METHODS ====================

  /**
   * Абстрактный метод навигации к элементу - должен быть реализован в наследниках
   */
  abstract navigateToItem(itemId: string): Promise<SidebarOperationResult>;

  /**
   * Абстрактный метод проверки активности элемента - должен быть реализован в наследниках
   */
  abstract isItemActive(itemId: string): Promise<boolean>;

  /**
   * Абстрактный метод получения текущего активного элемента - должен быть реализован в наследниках
   */
  abstract getCurrentActiveItem(): Promise<SidebarItemConfig | null>;

  // ==================== IMPLEMENTED METHODS ====================

  /**
   * Получить все категории
   */
  getCategories(): SidebarItemConfig[] {
    return this.getItemsByType(SidebarItemType.CATEGORY);
  }

  /**
   * Получить все секции
   */
  getSections(): SidebarItemConfig[] {
    return this.getItemsByType(SidebarItemType.SECTION);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Навигация к категории
   */
  protected async navigateToCategory(categoryId: string): Promise<SidebarOperationResult> {
    const validation = this.validateItem(categoryId);
    if (!validation.isValid) {
      const item = this.getItemById(categoryId) || { id: '', name: '', type: SidebarItemType.CATEGORY, selector: '', displayName: '' };
      return this.createOperationResult(false, item, validation.error);
    }

    const item = this.getItemById(categoryId);
    if (!item) {
      throw new Error(`Item not found: ${categoryId}`);
    }
    this.logStep(`Navigating to category: ${item.displayName}`);
    
    try {
      const locator = this.getItemLocator(categoryId);
      if (!locator) {
        throw new Error(`Locator not found for category: ${categoryId}`);
      }

      await locator.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess(`Navigated to category: ${item.displayName}`);
      return this.createOperationResult(true, item);
    } catch (error) {
      const errorMessage = `Failed to navigate to category ${item.displayName}: ${error}`;
      this.logError(errorMessage);
      return this.createOperationResult(false, item, errorMessage);
    }
  }

  /**
   * Навигация к секции
   */
  protected async navigateToSection(sectionId: string): Promise<SidebarOperationResult> {
    const validation = this.validateItem(sectionId);
    if (!validation.isValid) {
      const item = this.getItemById(sectionId) || { id: '', name: '', type: SidebarItemType.SECTION, selector: '', displayName: '' };
      return this.createOperationResult(false, item, validation.error);
    }

    const item = this.getItemById(sectionId);
    if (!item) {
      throw new Error(`Item not found: ${sectionId}`);
    }
    this.logStep(`Navigating to section: ${item.displayName}`);
    
    try {
      const locator = this.getItemLocator(sectionId);
      if (!locator) {
        throw new Error(`Locator not found for section: ${sectionId}`);
      }

      await locator.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess(`Navigated to section: ${item.displayName}`);
      return this.createOperationResult(true, item);
    } catch (error) {
      const errorMessage = `Failed to navigate to section ${item.displayName}: ${error}`;
      this.logError(errorMessage);
      return this.createOperationResult(false, item, errorMessage);
    }
  }

  /**
   * Проверить активность элемента
   */
  protected async checkItemActive(itemId: string): Promise<boolean> {
    const item = this.getItemById(itemId);
    if (!item) {
      this.logError(`Item with ID '${itemId}' not found`);
      return false;
    }

    this.logStep(`Checking if ${item.displayName} is active`);
    
    try {
      const locator = this.getItemLocator(itemId);
      if (!locator) return false;

      const isActive = await locator.locator('..').locator(`.${this.config.activeClass}`).count() > 0;
      this.logStep(`${item.displayName} active status: ${isActive}`);
      return isActive;
    } catch (error) {
      this.logError(`Failed to check active status for ${item.displayName}: ${error}`);
      return false;
    }
  }
}
