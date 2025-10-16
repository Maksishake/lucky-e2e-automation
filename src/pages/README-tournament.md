# Tournament Page - Страница турниров

## Описание
Полная реализация страницы турниров с поддержкой всех необходимых локаторов и методов для работы с турнирами.

## Структура файлов

### 1. `src/pages/tournament.page.ts`
Основная страница турниров с методами:
- `waitForPageLoad()` - ожидание загрузки страницы
- `getTournamentsCount()` - получение количества турниров
- `getTournamentInfo(index)` - получение информации о турнире по индексу
- `findTournamentByTitle(title)` - поиск турнира по названию
- `clickDetailsButtonByIndex(index)` - клик по кнопке "Деталі"
- `clickParticipateButtonByIndex(index)` - клик по кнопке "Прийняти участь"
- `getAllTournamentsInfo()` - получение информации о всех турнирах
- `getTournamentsByStatus(status)` - фильтрация турниров по статусу
- `getActiveTournaments()` - получение активных турниров
- `getCompletedTournaments()` - получение завершенных турниров
- `getPageStats()` - получение статистики страницы

### 2. `src/components/modals/tournament-modal.ts`
Модальное окно турнира с методами:
- `waitForModalOpen()` - ожидание открытия модального окна
- `waitForModalClose()` - ожидание закрытия модального окна
- `isModalOpen()` - проверка открытости модального окна
- `closeModal()` - закрытие модального окна
- `getTournamentInfo()` - получение информации о турнире из модального окна
- `clickParticipateButton()` - клик по кнопке "Прийняти участь"
- `getTimerInfo()` - получение информации о таймере
- `getPrizesTable()` - получение таблицы призов

### 3. `src/services/tournament.service.ts`
Сервис для работы с турнирами с методами:
- `navigateToTournaments()` - переход на страницу турниров
- `getAllTournaments()` - получение всех турниров
- `getTournamentByIndex(index)` - получение турнира по индексу
- `findTournamentByTitle(title)` - поиск турнира по названию
- `getActiveTournaments()` - получение активных турниров
- `getCompletedTournaments()` - получение завершенных турниров
- `openTournamentDetails(index)` - открытие деталей турнира
- `participateInTournament(index)` - участие в турнире
- `closeTournamentModal()` - закрытие модального окна
- `searchTournaments(filters)` - поиск турниров с фильтрами

### 4. `src/types/tournament.types.ts`
Типы для работы с турнирами:
- `TournamentInfo` - информация о турнире
- `TournamentModalInfo` - информация о модальном окне турнира
- `TournamentTimerInfo` - информация о таймере
- `TournamentPrize` - информация о призе
- `TournamentModalState` - состояние модального окна
- `TournamentPageStats` - статистика страницы турниров
- `TournamentFilters` - фильтры для поиска турниров
- `TournamentSearchResult` - результат поиска турниров

## Основные селекторы

### Страница турниров
- `.container .row.flex-col.gap-lg` - контейнер турниров
- `.card.card-promotion.card-unevenly` - карточки турниров
- `.card-image-wrapper .card-image` - изображения турниров
- `.card-content-wrapper .title` - названия турниров
- `.card-content-wrapper .excerpt` - описания турниров
- `.badge.bg-blue-opacity.border-blue.round` - бейджи призового фонда
- `.badge.round.bg-green-opacity.border-green` - бейджи статуса
- `button[onclick*="showModalFromRoot"]` - кнопки "Деталі"
- `button:has-text("Прийняти участь")` - кнопки участия

### Модальное окно турнира
- `#modal-tournament` - контейнер модального окна
- `#modal-tournament .modal-content` - содержимое модального окна
- `#modal-tournament .modal-header` - заголовок модального окна
- `#modal-tournament .modal-body` - тело модального окна
- `#modal-tournament .modal-footer` - подвал модального окна
- `#modal-tournament .btn-close` - кнопка закрытия
- `#modal-tournament .tournament-timer` - таймер турнира
- `#modal-tournament .prizes-table` - таблица призов

## Пример использования

```typescript
import { TournamentService } from '../services/tournament.service';

const tournamentService = new TournamentService(page);

// Переход на страницу турниров
await tournamentService.navigateToTournaments();

// Получение всех турниров
const tournaments = await tournamentService.getAllTournaments();

// Открытие деталей первого турнира
await tournamentService.openTournamentDetails(0);

// Получение информации о модальном окне
const modalInfo = await tournamentService.getTournamentModalInfo();

// Закрытие модального окна
await tournamentService.closeTournamentModal();

// Поиск активных турниров
const activeTournaments = await tournamentService.getActiveTournaments();

// Поиск турниров с фильтрами
const filteredTournaments = await tournamentService.searchTournaments({
  status: 'active',
  prizeFundMin: 10000,
  prizeFundMax: 50000
});
```

## Особенности реализации

1. **Полная поддержка Livewire** - все селекторы учитывают динамические ID компонентов
2. **Гибкая фильтрация** - поддержка фильтров по статусу и призовому фонду
3. **Работа с модальными окнами** - полная поддержка открытия/закрытия модальных окон
4. **Типизация** - полная типизация всех данных и состояний
5. **Обработка ошибок** - robust обработка ошибок во всех методах
6. **Логирование** - подробное логирование всех операций
