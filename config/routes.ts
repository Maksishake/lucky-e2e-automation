const BASE_URL = 'https://luckycoin777.live';
const CATEGORY_URL = 'https://luckycoin777.live/category';
const STAGE_URL = 'https://stage.luckycoin.live';

export const Routes = {
  // ============ ОСНОВНЫЕ СТРАНИЦЫ ============
  HOME: `${BASE_URL}/`,
  HOME_STAGE: `${STAGE_URL}/`,
  
  // ============ ИГРОВЫЕ РАЗДЕЛЫ ============
  ALL: `${CATEGORY_URL}/all`,
  POPULAR: `${CATEGORY_URL}/popular`,
  NEW: `${CATEGORY_URL}/new`,
  SLOTS: `${CATEGORY_URL}/slots`,
  BUY_BONUS: `${CATEGORY_URL}/buy-bonus`,
  LIVE_CASINO: `${CATEGORY_URL}/live-casino`,
  SHOW_GAMES: `${CATEGORY_URL}/show-games`,
  FAVORITES: `${CATEGORY_URL}/favorites`,
  
  // ============ ПРОМО И БОНУСЫ ============
  BONUSES: `${BASE_URL}/bonuses`,
  TOURNAMENTS: `${BASE_URL}/tournaments`,
  
  // ============ КРИПТО И ПЛАТЕЖИ ============
  CRYPTO: `${BASE_URL}/crypto`,
  
  // ============ ПОЛЬЗОВАТЕЛЬСКИЕ РАЗДЕЛЫ ============
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  PROFILE: `${BASE_URL}/profile`,
  ACCOUNT: `${BASE_URL}/account`,
  
  // ============ КОШЕЛЕК И ТРАНЗАКЦИИ ============
  WALLET: `${BASE_URL}/wallet`,
  DEPOSIT: `${BASE_URL}/deposit`,
  WITHDRAWAL: `${BASE_URL}/withdrawal`,
  TRANSACTION_HISTORY: `${BASE_URL}/transaction-history`,
  
  // ============ ДРУГИЕ РАЗДЕЛЫ ============
  GAMES: `${BASE_URL}/games`,
  PROVIDERS: `${BASE_URL}/providers`,
  GAMES_URL: `${BASE_URL}/games/`,
  SUPPORT: `${BASE_URL}/support`,
  FAQ: `${BASE_URL}/faq`,
  TERMS: `${BASE_URL}/terms`,
  PRIVACY: `${BASE_URL}/privacy`,

  // ============ ИГРЫ URL ============
  REAL_GAME_URL : `${BASE_URL}/play/real`,
  DEMO_GAME_URL : `${BASE_URL}/play/demo`
} as const;

/**
 * Типы маршрутов
 */
export type RouteKey = keyof typeof Routes;
export type RouteValue = typeof Routes[RouteKey];

/**
 * Список маршрутов игровых разделов для тестирования sidebar
 */
export const GAME_ROUTES = [
  { key: 'ALL', route: Routes.ALL, name: 'All Games' },
  { key: 'POPULAR', route: Routes.POPULAR, name: 'Popular' },
  { key: 'NEW', route: Routes.NEW, name: 'New Games' },
  { key: 'SLOTS', route: Routes.SLOTS, name: 'Slots' },
  { key: 'BUY_BONUS', route: Routes.BUY_BONUS, name: 'Buy Bonus' },
  { key: 'LIVE_CASINO', route: Routes.LIVE_CASINO, name: 'Live Casino' },
  { key: 'SHOW_GAMES', route: Routes.SHOW_GAMES, name: 'Show Games' },
  { key: 'FAVORITES', route: Routes.FAVORITES, name: 'Favorites' }
] as const;

/**
 * Список промо разделов
 */
export const PROMO_ROUTES = [
  { key: 'BONUSES', route: Routes.BONUSES, name: 'Bonuses' },
  { key: 'TOURNAMENTS', route: Routes.TOURNAMENTS, name: 'Tournaments' }
] as const;

/**
 * Все разделы sidebar для проверки
 */
export const ALL_SIDEBAR_ROUTES = [
  ...GAME_ROUTES,
  ...PROMO_ROUTES,
  { key: 'CRYPTO', route: Routes.CRYPTO, name: 'Crypto' }
] as const;

/**
 * Вспомогательная функция для получения пути без домена
 */
export function getRoutePath(route: string): string {
  return route.replace(BASE_URL, '');
}

/**
 * Вспомогательная функция для проверки, является ли URL игровым разделом
 */
export function isGameRoute(url: string): boolean {
  return GAME_ROUTES.some(r => url.includes(getRoutePath(r.route)));
}

/**
 * Вспомогательная функция для проверки, является ли URL промо разделом
 */
export function isPromoRoute(url: string): boolean {
  return PROMO_ROUTES.some(r => url.includes(getRoutePath(r.route)));
}