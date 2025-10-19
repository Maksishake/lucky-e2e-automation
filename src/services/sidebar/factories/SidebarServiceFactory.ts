/**
 * Factory for creating Sidebar services
 * Фабрика для создания сервисов сайдбара
 */

import { Page } from '@playwright/test';
import { SidebarNavigationImpl } from '../implementations/SidebarNavigationImpl';
import { SidebarActionsImpl } from '../implementations/SidebarActionsImpl';
import { SidebarSearchImpl } from '../implementations/SidebarSearchImpl';
import { SidebarLanguageImpl } from '../implementations/SidebarLanguageImpl';
import { ISidebarNavigation } from '../interfaces/ISidebarNavigation';
import { ISidebarActions } from '../interfaces/ISidebarActions';
import { ISidebarSearch } from '../interfaces/ISidebarSearch';
import { ISidebarLanguage } from '../interfaces/ISidebarLanguage';

/**
 * Фабрика для создания сервисов сайдбара
 * Применяет принцип Factory Method
 */
export class SidebarServiceFactory {
  /**
   * Создать сервис навигации
   */
  static createNavigationService(page: Page): ISidebarNavigation {
    return new SidebarNavigationImpl(page);
  }

  /**
   * Создать сервис действий
   */
  static createActionsService(page: Page): ISidebarActions {
    return new SidebarActionsImpl(page);
  }

  /**
   * Создать сервис поиска
   */
  static createSearchService(page: Page): ISidebarSearch {
    return new SidebarSearchImpl(page);
  }

  /**
   * Создать сервис языков
   */
  static createLanguageService(page: Page): ISidebarLanguage {
    return new SidebarLanguageImpl(page);
  }

  /**
   * Создать все сервисы сайдбара
   */
  static createAllServices(page: Page): {
    navigation: ISidebarNavigation;
    actions: ISidebarActions;
    search: ISidebarSearch;
    language: ISidebarLanguage;
  } {
    return {
      navigation: this.createNavigationService(page),
      actions: this.createActionsService(page),
      search: this.createSearchService(page),
      language: this.createLanguageService(page)
    };
  }

  /**
   * Создать сервис по типу
   */
  static createServiceByType(
    page: Page, 
    serviceType: 'navigation' | 'actions' | 'search' | 'language'
  ): ISidebarNavigation | ISidebarActions | ISidebarSearch | ISidebarLanguage {
    switch (serviceType) {
      case 'navigation':
        return this.createNavigationService(page);
      case 'actions':
        return this.createActionsService(page);
      case 'search':
        return this.createSearchService(page);
      case 'language':
        return this.createLanguageService(page);
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }
  }
}
