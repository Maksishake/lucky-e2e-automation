/**
 * Sidebar Services - Main export file
 * Главный файл экспорта сервисов сайдбара
 */

// ==================== INTERFACES ====================
export type { ISidebarService } from './interfaces/ISidebarService';
export type { ISidebarNavigation } from './interfaces/ISidebarNavigation';
export type { ISidebarActions } from './interfaces/ISidebarActions';
export type { ISidebarSearch } from './interfaces/ISidebarSearch';
export type { ISidebarLanguage } from './interfaces/ISidebarLanguage';

// ==================== BASE CLASSES ====================
export { BaseSidebarService } from './base/BaseSidebarService';
export { BaseSidebarNavigation } from './base/BaseSidebarNavigation';
export { BaseSidebarActions } from './base/BaseSidebarActions';

// ==================== IMPLEMENTATIONS ====================
export { SidebarNavigationImpl } from './implementations/SidebarNavigationImpl';
export { SidebarActionsImpl } from './implementations/SidebarActionsImpl';
export { SidebarSearchImpl } from './implementations/SidebarSearchImpl';
export { SidebarLanguageImpl } from './implementations/SidebarLanguageImpl';

// ==================== FACTORIES ====================
export { SidebarServiceFactory } from './factories/SidebarServiceFactory';

// ==================== TYPES ====================
export * from './types/sidebar.types';

// ==================== LEGACY SERVICES (for backward compatibility) ====================
// Legacy services have been removed and replaced with new architecture