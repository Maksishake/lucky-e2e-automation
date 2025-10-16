/**
 * Tournament Types - Типы для работы с турнирами
 */

export interface TournamentInfo {
  index: number;
  title: string;
  excerpt: string;
  prizeFund: string;
  status: string;
  hasDetailsButton: boolean;
  hasParticipateButton: boolean;
}

export interface TournamentModalInfo {
  title: string;
  description: string;
  prizeFund: string;
  rules: string;
  participationInfo: string;
}

export interface TournamentTimerInfo {
  timeRemaining: string;
  isActive: boolean;
}

export interface TournamentPrize {
  position: string;
  prize: string;
}

export interface TournamentModalState {
  isOpen: boolean;
  tournamentInfo: TournamentModalInfo | null;
  timerInfo: TournamentTimerInfo | null;
  prizesTable: TournamentPrize[];
  hasParticipateButton: boolean;
  hasCancelButton: boolean;
}

export interface TournamentPageStats {
  tournamentsCount: number;
  activeTournaments: number;
  completedTournaments: number;
  hasTournaments: boolean;
  imagesLoaded: boolean;
}

export interface TournamentFilters {
  status?: 'active' | 'completed' | 'all';
  prizeFundMin?: number;
  prizeFundMax?: number;
}

export interface TournamentSearchResult {
  tournaments: TournamentInfo[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
}
