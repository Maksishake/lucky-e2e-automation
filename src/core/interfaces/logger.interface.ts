/**
 * Logger Interface - Интерфейс для логирования
 */

export interface ILogger {
  info(component: string, message: string): void;
  error(component: string, message: string, error?: unknown): void;
  assertion(testName: string, expected: boolean, actual: boolean, passed: boolean): void;
  testStart(testName: string, fileName: string): void;
}
