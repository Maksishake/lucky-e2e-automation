/**
 * Game Types - Типы для игр, категорий и провайдеров
 */

export type GameCategory = {
  id: number;
  name: string;
  icon: string;
  count: number;
  isActive: boolean;
};

export type GameProvider = {
  id: number;
  name: string;
  count: number;
  isActive: boolean;
};

export type Game = {
  id: string;
  title: string;
  provider: string;
  imageUrl: string;
  isFavorite: boolean;
  hasDemo: boolean;
  hasReal: boolean;
  category: string;
  gameUrl: string;
  demoUrl?: string;
};

export type BannerSlide = {
  id: string;
  title: string;
  imageUrl: string;
  gameUrl: string;
  isActive: boolean;
};

export type GameFilterState = {
  selectedCategory: number;
  selectedProvider: number;
  searchQuery: string;
  showFavorites: boolean;
};

export type GameGridState = {
  games: Game[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
};

export type QrPanelData = {
  title: string;
  qrCodeUrl: string;
  buttonText: string;
  buttonUrl: string;
  isVisible: boolean;
};

export type GameAction = 'real' | 'demo' | 'favorite';

export type GameCardHoverState = {
  isHovered: boolean;
  showButtons: boolean;
  showFavorite: boolean;
};

export type SliderState = {
  currentSlide: number;
  totalSlides: number;
  isAutoPlay: boolean;
  isDragging: boolean;
};

export type FilterDropdownState = {
  isCategoriesOpen: boolean;
  isProvidersOpen: boolean;
  isSearchOpen: boolean;
};

export type GameSearchResult = {
  games: Game[];
  totalCount: number;
  hasMore: boolean;
};
