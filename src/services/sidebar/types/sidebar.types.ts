/**
 * Types and interfaces for Sidebar Services
 * Типы и интерфейсы для сервисов сайдбара
 */

// ==================== ENUMS ====================

/**
 * Типы элементов сайдбара
 */
export enum SidebarItemType {
  CATEGORY = 'category',
  SECTION = 'section',
  ACTION = 'action',
  BUTTON = 'button'
}

/**
 * Статусы элементов сайдбара
 */
export enum SidebarItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISABLED = 'disabled'
}

// ==================== INTERFACES ====================

/**
 * Конфигурация элемента сайдбара
 */
export interface SidebarItemConfig {
  readonly id: string;
  readonly name: string;
  readonly href?: string;
  readonly type: SidebarItemType;
  readonly selector: string;
  readonly displayName: string;
  readonly icon?: string;
  readonly isExternal?: boolean;
}

/**
 * Результат операции с сайдбаром
 */
export interface SidebarOperationResult {
  readonly success: boolean;
  readonly item: SidebarItemConfig;
  readonly error?: string;
  readonly timestamp: Date;
}

/**
 * Конфигурация сайдбара
 */
export interface SidebarConfig {
  readonly sidebarSelector: string;
  readonly menuListSelector: string;
  readonly menuItemSelector: string;
  readonly activeClass: string;
  readonly waitTimeout: number;
}

// ==================== CONSTANTS ====================

/**
 * Конфигурация по умолчанию
 */
export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  sidebarSelector: 'sidebar.menu',
  menuListSelector: '.menu-list',
  menuItemSelector: 'li',
  activeClass: 'current-page',
  waitTimeout: 5000
} as const;

/**
 * Предопределенные элементы сайдбара
 */
export const SIDEBAR_ITEMS: readonly SidebarItemConfig[] = [
  // Категории игр
  {
    id: 'all-games',
    name: 'All Games',
    href: '/category/all',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/all"]',
    displayName: 'Усі',
    icon: 'all-games-icon'
  },
  {
    id: 'popular',
    name: 'Popular',
    href: '/category/popular',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/popular"]',
    displayName: 'Popular',
    icon: 'popular-icon'
  },
  {
    id: 'new',
    name: 'New',
    href: '/category/new',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/new"]',
    displayName: 'New',
    icon: 'new-icon'
  },
  {
    id: 'slots',
    name: 'Slots',
    href: '/category/slots',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/slots"]',
    displayName: 'Slots',
    icon: 'slots-icon'
  },
  {
    id: 'buy-bonus',
    name: 'Buy Bonus',
    href: '/category/buy-bonus',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/buy-bonus"]',
    displayName: 'Buy Bonus',
    icon: 'buy-bonus-icon'
  },
  {
    id: 'live-casino',
    name: 'Live Casino',
    href: '/category/live-casino',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/live-casino"]',
    displayName: 'Live Casino',
    icon: 'live-casino-icon'
  },
  {
    id: 'show-games',
    name: 'Show Games',
    href: '/category/show-games',
    type: SidebarItemType.CATEGORY,
    selector: 'a[href*="/category/show-games"]',
    displayName: 'Show Games',
    icon: 'show-games-icon'
  },
  // Секции
  {
    id: 'favorites',
    name: 'Favorites',
    href: '/favorite',
    type: SidebarItemType.SECTION,
    selector: 'a[href*="/favorite"]',
    displayName: 'Вибране',
    icon: 'favorites-icon'
  },
  {
    id: 'bonuses',
    name: 'Bonuses',
    href: '/bonuses',
    type: SidebarItemType.SECTION,
    selector: 'a[href*="/bonuses"]',
    displayName: 'Бонуси',
    icon: 'bonuses-icon'
  },
  {
    id: 'tournaments',
    name: 'Tournaments',
    href: '/tournaments',
    type: SidebarItemType.SECTION,
    selector: 'a[href*="/tournaments"]',
    displayName: 'Турніри',
    icon: 'tournaments-icon'
  },
  // Действия
  {
    id: 'promocode',
    name: 'Promocode',
    type: SidebarItemType.ACTION,
    selector: 'a[onclick*="modal-promocode"]',
    displayName: 'Промо-код',
    icon: 'promocode-icon'
  },
  {
    id: 'get-money',
    name: 'Get Money',
    href: 'https://bitcapital.top',
    type: SidebarItemType.ACTION,
    selector: 'a[href*="bitcapital.top"]',
    displayName: 'Отримати грошi',
    icon: 'get-money-icon',
    isExternal: true
  },
  {
    id: 'telegram',
    name: 'Telegram',
    type: SidebarItemType.ACTION,
    selector: 'button[onclick*="t.me/lucky_coin_gold"]',
    displayName: 'Telegram',
    icon: 'telegram-icon'
  },
  {
    id: 'support',
    name: 'Support',
    type: SidebarItemType.ACTION,
    selector: 'button.btn-live-support',
    displayName: 'Support',
    icon: 'support-icon'
  }
] as const;
