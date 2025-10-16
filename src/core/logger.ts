/**
 * Logger - Система логирования для E2E тестов
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: unknown;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  /**
   * Получить экземпляр логгера (Singleton)
   */
  public static getInstance(logLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  /**
   * Установить уровень логирования
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Получить текущий уровень логирования
   */
  public getLogLevel(): LogLevel {
    return this.logLevel;
  }

  /**
   * Логирование ошибки
   */
  public error(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, component, message, data);
  }

  /**
   * Логирование предупреждения
   */
  public warn(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, component, message, data);
  }

  /**
   * Логирование информации
   */
  public info(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, component, message, data);
  }

  /**
   * Логирование отладки
   */
  public debug(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, component, message, data);
  }

  /**
   * Логирование трассировки
   */
  public trace(component: string, message: string, data?: unknown): void {
    this.log(LogLevel.TRACE, component, message, data);
  }

  /**
   * Основной метод логирования
   */
  private log(level: LogLevel, component: string, message: string, data?: unknown): void {
    if (level > this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data
    };

    this.logs.push(entry);

    // Ограничиваем количество логов в памяти
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Выводим в консоль
    this.printToConsole(entry);
  }

  /**
   * Вывод в консоль с цветовой кодировкой
   */
  private printToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp;
    const levelName = LogLevel[entry.level];
    const component = entry.component;
    const message = entry.message;
    const data = entry.data;

    let colorCode = '';
    const resetCode = '\x1b[0m';

    switch (entry.level) {
      case LogLevel.ERROR:
        colorCode = '\x1b[31m'; // Красный
        break;
      case LogLevel.WARN:
        colorCode = '\x1b[33m'; // Желтый
        break;
      case LogLevel.INFO:
        colorCode = '\x1b[36m'; // Голубой
        break;
      case LogLevel.DEBUG:
        colorCode = '\x1b[35m'; // Пурпурный
        break;
      case LogLevel.TRACE:
        colorCode = '\x1b[90m'; // Серый
        break;
    }

    const logMessage = `${colorCode}[${timestamp}] [${levelName}] [${component}] ${message}${resetCode}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  /**
   * Получить все логи
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Получить логи по компоненту
   */
  public getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  /**
   * Получить логи по уровню
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Получить логи за период
   */
  public getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }

  /**
   * Очистить логи
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Экспорт логов в JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Экспорт логов в CSV
   */
  public exportLogsToCSV(): string {
    const headers = ['timestamp', 'level', 'component', 'message', 'data'];
    const csvRows = [headers.join(',')];

    this.logs.forEach(log => {
      const row = [
        log.timestamp,
        LogLevel[log.level],
        log.component,
        `"${log.message.replace(/"/g, '""')}"`,
        log.data ? `"${JSON.stringify(log.data).replace(/"/g, '""')}"` : ''
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Сохранить логи в файл
   */
  public async saveLogsToFile(filename: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const logsDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logsDir, { recursive: true });
    
    const filePath = path.join(logsDir, filename);
    await fs.writeFile(filePath, this.exportLogs());
  }

  /**
   * Логирование начала теста
   */
  public testStart(testName: string, testFile: string): void {
    this.info('TEST', `Starting test: ${testName}`, { testFile });
  }

  /**
   * Логирование завершения теста
   */
  public testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED', duration?: number): void {
    const message = `Test ${status.toLowerCase()}: ${testName}`;
    const data = { status, duration };
    
    if (status === 'PASSED') {
      this.info('TEST', message, data);
    } else if (status === 'FAILED') {
      this.error('TEST', message, data);
    } else {
      this.warn('TEST', message, data);
    }
  }

  /**
   * Логирование шага теста
   */
  public testStep(stepName: string, description: string, data?: unknown): void {
    this.info('STEP', `${stepName}: ${description}`, data);
  }

  /**
   * Логирование действия пользователя
   */
  public userAction(action: string, element?: string, value?: unknown): void {
    this.info('ACTION', action, { element, value });
  }

  /**
   * Логирование проверки
   */
  public assertion(description: string, expected: unknown, actual: unknown, passed: boolean): void {
    const level = passed ? LogLevel.INFO : LogLevel.ERROR;
    const message = `Assertion ${passed ? 'PASSED' : 'FAILED'}: ${description}`;
    const data = { expected, actual, passed };
    
    this.log(level, 'ASSERT', message, data);
  }

  /**
   * Логирование сетевого запроса
   */
  public networkRequest(method: string, url: string, status?: number, duration?: number): void {
    const message = `${method} ${url}`;
    const data = { method, url, status, duration };
    
    if (status && status >= 400) {
      this.error('NETWORK', message, data);
    } else if (status && status >= 300) {
      this.warn('NETWORK', message, data);
    } else {
      this.info('NETWORK', message, data);
    }
  }

  /**
   * Логирование ошибки браузера
   */
  public browserError(error: string, stack?: string): void {
    this.error('BROWSER', error, { stack });
  }

  /**
   * Логирование производительности
   */
  public performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info('PERF', `${metric}: ${value}${unit}`);
  }

  /**
   * Логирование скриншота
   */
  public screenshot(name: string, path: string): void {
    this.info('SCREENSHOT', `Screenshot saved: ${name}`, { path });
  }

  /**
   * Логирование видео
   */
  public video(name: string, path: string): void {
    this.info('VIDEO', `Video saved: ${name}`, { path });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();