# ПЛАН НЕМЕДЛЕННЫХ ДЕЙСТВИЙ
## Что делать прямо сейчас

**Дата:** 2024-12-19  
**Приоритет:** ВЫСОКИЙ  

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ (исправить СЕЙЧАС)

### 1. Исправить ошибки в существующих файлах

**Файл:** `src/services/game/game-detection.service.ts`
- ❌ **Проблема:** Неправильный импорт `GameInfo`
- ✅ **Решение:** Изменить `import { GameInfo } from '../../types/game.types';` на `import { GameInfo } from '@/types/game.types';`

**Файл:** `src/services/game/game-interaction.service.ts`
- ❌ **Проблема:** Неправильный импорт `GameInfo`
- ✅ **Решение:** Изменить `import { GameInfo } from '../../types/game.types';` на `import { GameInfo } from '@/types/game.types';`

**Файл:** `src/services/game/game-validation.service.ts`
- ❌ **Проблема:** Неправильный импорт `GameStabilityResult`
- ✅ **Решение:** Изменить `import { GameStabilityResult } from '../../types/game.types';` на `import { GameStabilityResult } from '@/types/game.types';`

### 2. Исправить ошибки в тестах

**Файл:** `tests/smoke/game-stability.spec.ts`
- ❌ **Проблема:** Неправильный импорт `GameServiceFactory`
- ✅ **Решение:** Изменить `import { GameServiceFactory } from '@/core/factories/GameServiceFactory';` на `import { GameServiceFactory } from '@/core/factories/GameServiceFactory';`

---

## 🔧 НЕМЕДЛЕННЫЕ ИСПРАВЛЕНИЯ

### Шаг 1: Исправить импорты (5 минут)

```bash
# Найти все файлы с неправильными импортами
find src -name "*.ts" -exec grep -l "from '../../types/game.types'" {} \;

# Заменить импорты
sed -i "s|from '../../types/game.types'|from '@/types/game.types'|g" src/**/*.ts
```

### Шаг 2: Проверить компиляцию (2 минуты)

```bash
# Проверить TypeScript
npx tsc --noEmit

# Проверить ESLint
npx eslint src --ext .ts
```

### Шаг 3: Запустить тесты (5 минут)

```bash
# Запустить один тест для проверки
npx playwright test tests/smoke/game-stability.spec.ts --headed
```

---

## 📋 ПЛАН НА СЛЕДУЮЩИЕ 2 ЧАСА

### Час 1: Создать базовые компоненты

1. **Создать `src/core/selectors/GameSelectors.ts`** (15 минут)
2. **Создать `src/core/constants/GameConstants.ts`** (15 минут)
3. **Создать `src/services/game/base/BaseGameService.ts`** (30 минут)

### Час 2: Создать infrastructure сервисы

1. **Создать `src/services/game/infrastructure/GameIframeService.ts`** (30 минут)
2. **Создать `src/services/game/infrastructure/GameCanvasService.ts`** (30 минут)

---

## 🎯 ЦЕЛИ НА СЕГОДНЯ

- [ ] Исправить все критические ошибки
- [ ] Создать базовые компоненты
- [ ] Создать infrastructure сервисы
- [ ] Запустить тесты и убедиться, что они работают

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **НЕ УДАЛЯЙТЕ** существующие файлы до полного тестирования
2. **СОЗДАВАЙТЕ** новые файлы параллельно со старыми
3. **ТЕСТИРУЙТЕ** каждый шаг перед переходом к следующему
4. **ДЕЛАЙТЕ** коммиты после каждого успешного шага

---

## 🚀 КОМАНДЫ ДЛЯ ВЫПОЛНЕНИЯ

```bash
# 1. Исправить импорты
find src -name "*.ts" -exec sed -i "s|from '../../types/game.types'|from '@/types/game.types'|g" {} \;

# 2. Проверить компиляцию
npx tsc --noEmit

# 3. Запустить тесты
npx playwright test tests/smoke/game-stability.spec.ts --headed

# 4. Создать папки
mkdir -p src/core/selectors
mkdir -p src/core/constants
mkdir -p src/services/game/base
mkdir -p src/services/game/infrastructure
mkdir -p src/services/game/domain
```

---

## 📞 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

1. **Проверьте** консоль на ошибки
2. **Посмотрите** логи тестов
3. **Убедитесь**, что все импорты правильные
4. **Проверьте**, что все файлы созданы

**Главное:** Не паникуйте! Все проблемы решаемы. Просто следуйте плану пошагово.
