/**
 * Base Component - Базовый класс для всех компонентов
 */

import { Page } from '@playwright/test';
import { BaseService } from './base.service';

export abstract class BaseComponent extends BaseService {
  protected componentSelector: string;

  constructor(page: Page, componentName: string, componentSelector?: string) {
    super(page, componentName);
    this.componentSelector = componentSelector || `[data-component="${componentName}"]`;
  }

  /**
   * Проверить, видим ли компонент
   */
  async isVisible(): Promise<boolean> {
    return await this.isElementVisible(this.componentSelector);
  }

  /**
   * Проверить, существует ли компонент
   */
  async exists(): Promise<boolean> {
    return await this.isElementExists(this.componentSelector);
  }

  /**
   * Дождаться появления компонента
   */
  async waitForAppear(): Promise<void> {
    await this.waitForElementToAppear(this.componentSelector);
  }

  /**
   * Дождаться исчезновения компонента
   */
  async waitForDisappear(): Promise<void> {
    await this.waitForElementToDisappear(this.componentSelector);
  }

  /**
   * Получить текст компонента
   */
  async getText(): Promise<string> {
    return await this.getElementText(this.componentSelector);
  }

  /**
   * Получить HTML содержимое компонента
   */
  async getHTML(): Promise<string> {
    return await this.page.locator(this.componentSelector).innerHTML();
  }

  /**
   * Получить атрибут компонента
   */
  async getAttribute(attributeName: string): Promise<string | null> {
    return await this.page.locator(this.componentSelector).getAttribute(attributeName);
  }

  /**
   * Получить все атрибуты компонента
   */
  async getAllAttributes(): Promise<Record<string, string | null>> {
    const element = this.page.locator(this.componentSelector);
    const attributes: Record<string, string | null> = {};
    
    // Получаем основные атрибуты
    const commonAttributes = ['id', 'class', 'data-testid', 'data-component', 'type', 'value', 'placeholder'];
    
    for (const attr of commonAttributes) {
      attributes[attr] = await element.getAttribute(attr);
    }
    
    return attributes;
  }

  /**
   * Проверить наличие CSS класса
   */
  async hasClass(className: string): Promise<boolean> {
    const classes = await this.getAttribute('class');
    return classes?.includes(className) || false;
  }

  /**
   * Проверить наличие data-атрибута
   */
  async hasDataAttribute(attributeName: string): Promise<boolean> {
    const value = await this.getAttribute(`data-${attributeName}`);
    return value !== null;
  }

  /**
   * Получить значение data-атрибута
   */
  async getDataAttribute(attributeName: string): Promise<string | null> {
    return await this.getAttribute(`data-${attributeName}`);
  }

  /**
   * Кликнуть по компоненту
   */
  async click(): Promise<void> {
    await this.clickElement(this.componentSelector);
  }

  /**
   * Двойной клик по компоненту
   */
  async doubleClick(): Promise<void> {
    await this.doubleClickElement(this.componentSelector);
  }

  /**
   * Правый клик по компоненту
   */
  async rightClick(): Promise<void> {
    await this.rightClickElement(this.componentSelector);
  }

  /**
   * Навести мышь на компонент
   */
  async hover(): Promise<void> {
    await this.hoverElement(this.componentSelector);
  }

  /**
   * Скролл к компоненту
   */
  async scrollIntoView(): Promise<void> {
    await this.scrollToElement(this.componentSelector);
  }

  /**
   * Получить позицию компонента
   */
  async getPosition(): Promise<{ x: number; y: number }> {
    const box = await this.page.locator(this.componentSelector).boundingBox();
    return {
      x: box?.x || 0,
      y: box?.y || 0
    };
  }

  /**
   * Получить размер компонента
   */
  async getSize(): Promise<{ width: number; height: number }> {
    const box = await this.page.locator(this.componentSelector).boundingBox();
    return {
      width: box?.width || 0,
      height: box?.height || 0
    };
  }

  /**
   * Проверить, находится ли компонент в области видимости
   */
  async isInViewport(): Promise<boolean> {
    return await this.page.locator(this.componentSelector).isVisible();
  }

  /**
   * Получить дочерние элементы
   */
  async getChildren(): Promise<string[]> {
    const children = this.page.locator(`${this.componentSelector} > *`);
    const count = await children.count();
    const selectors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const child = children.nth(i);
      const tagName = await child.evaluate(el => el.tagName.toLowerCase());
      const className = await child.getAttribute('class');
      const id = await child.getAttribute('id');
      
      let selector = tagName;
      if (id) selector += `#${id}`;
      if (className) selector += `.${className.split(' ').join('.')}`;
      
      selectors.push(selector);
    }
    
    return selectors;
  }

  /**
   * Найти дочерний элемент по селектору
   */
  async findChild(selector: string): Promise<boolean> {
    const child = this.page.locator(`${this.componentSelector} ${selector}`);
    return await child.isVisible();
  }

  /**
   * Получить текст дочернего элемента
   */
  async getChildText(selector: string): Promise<string> {
    const child = this.page.locator(`${this.componentSelector} ${selector}`);
    return await child.textContent() || '';
  }

  /**
   * Кликнуть по дочернему элементу
   */
  async clickChild(selector: string): Promise<void> {
    const child = this.page.locator(`${this.componentSelector} ${selector}`);
    await child.click();
  }

  /**
   * Проверить, заблокирован ли компонент
   */
  async isDisabled(): Promise<boolean> {
    const element = this.page.locator(this.componentSelector);
    return await element.isDisabled();
  }

  /**
   * Проверить, выбран ли компонент (для чекбоксов, радиокнопок)
   */
  async isChecked(): Promise<boolean> {
    const element = this.page.locator(this.componentSelector);
    return await element.isChecked();
  }

  /**
   * Получить значение компонента
   */
  async getValue(): Promise<string> {
    const element = this.page.locator(this.componentSelector);
    return await element.inputValue();
  }

  /**
   * Установить значение компонента
   */
  async setValue(value: string): Promise<void> {
    await this.fillField(this.componentSelector, value);
  }

  /**
   * Очистить значение компонента
   */
  async clearValue(): Promise<void> {
    await this.clearField(this.componentSelector);
  }

}
