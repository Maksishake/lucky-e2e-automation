/**
 * Base Page - Базовый класс для всех страниц
 */

import { Page, Locator } from '@playwright/test';
import { BaseService } from './base.service';

export abstract class BasePage extends BaseService {
  protected url: string;
  protected pageTitle: string;

  constructor(page: Page, pageName: string, url?: string, pageTitle?: string) {
    super(page, pageName);
    this.url = url || '';
    this.pageTitle = pageTitle || '';
  }

  /**
   * Перейти на страницу
   */
  async navigate(): Promise<void> {
    if (this.url) {
      this.logStep(`Navigating to ${this.url}`);
      await this.navigateTo(this.url);
      await this.waitForPageToLoad();
      this.logSuccess(`Navigated to ${this.url}`);
    }
  }

  /**
   * Проверить, что мы на правильной странице
   */
  async isOnPage(): Promise<boolean> {
    if (this.url) {
      const currentUrl = this.getCurrentUrl();
      return currentUrl.includes(this.url) || currentUrl.includes(this.url.replace('/', ''));
    }
    return true;
  }

  /**
   * Проверить заголовок страницы
   */
  async hasCorrectTitle(): Promise<boolean> {
    if (this.pageTitle) {
      const title = await this.getPageTitle();
      return title.includes(this.pageTitle);
    }
    return true;
  }

  /**
   * Дождаться загрузки страницы
   */
  async waitForPageToLoad(): Promise<void> {
    await this.waitForPageLoad();
    await this.waitForNetworkIdle();
  }

  /**
   * Обновить страницу
   */
  async refresh(): Promise<void> {
    this.logStep('Refreshing page');
    await this.refreshPage();
    await this.waitForPageToLoad();
    this.logSuccess('Page refreshed');
  }

  /**
   * Получить текущий URL
   */
  getUrl(): string {
    return this.getCurrentUrl();
  }

  /**
   * Получить заголовок страницы
   */
  async getTitle(): Promise<string> {
    return await this.getPageTitle();
  }

  /**
   * Проверить наличие элемента на странице
   */
  async hasElement(selector: string): Promise<boolean> {
    return await this.isElementExists(selector);
  }

  /**
   * Проверить видимость элемента на странице
   */
  async isElementVisibleOnPage(selector: string): Promise<boolean> {
    return await this.isElementVisible(selector);
  }

  /**
   * Дождаться появления элемента
   */
  async waitForElementOnPage(selector: string, timeout: number = 10000): Promise<void> {
    await this.waitForElement(selector, timeout);
  }

  /**
   * Получить текст элемента
   */
  async getElementTextFromPage(selector: string): Promise<string> {
    return await this.getElementText(selector);
  }

  /**
   * Кликнуть по элементу
   */
  async clickElementOnPage(selector: string): Promise<void> {
    await this.clickElement(selector);
  }

  /**
   * Заполнить поле
   */
  async fillFieldOnPage(selector: string, value: string): Promise<void> {
    await this.fillField(selector, value);
  }

  /**
   * Проверить наличие текста на странице
   */
  async hasText(text: string): Promise<boolean> {
    const body = this.page.locator('body');
    const content = await body.textContent();
    return content?.includes(text) || false;
  }

  /**
   * Проверить наличие заголовка на странице
   */
  async hasHeading(heading: string, level: number = 1): Promise<boolean> {
    const headingSelector = `h${level}`;
    const headings = this.page.locator(headingSelector);
    const count = await headings.count();
    
    for (let i = 0; i < count; i++) {
      const headingText = await headings.nth(i).textContent();
      if (headingText?.includes(heading)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Получить все заголовки на странице
   */
  async getHeadings(): Promise<Array<{ level: number; text: string }>> {
    const headings: Array<{ level: number; text: string }> = [];
    
    for (let level = 1; level <= 6; level++) {
      const headingElements = this.page.locator(`h${level}`);
      const count = await headingElements.count();
      
      for (let i = 0; i < count; i++) {
        const text = await headingElements.nth(i).textContent();
        if (text) {
          headings.push({ level, text: text.trim() });
        }
      }
    }
    
    return headings;
  }

  /**
   * Проверить наличие ссылки
   */
  async hasLink(text: string, href?: string): Promise<boolean> {
    const link = this.page.locator(`a:has-text("${text}")`);
    if (href) {
      const linkHref = await link.getAttribute('href');
      return await link.isVisible() && linkHref === href;
    }
    return await link.isVisible();
  }

  /**
   * Кликнуть по ссылке
   */
  async clickLink(text: string): Promise<void> {
    const link = this.page.locator(`a:has-text("${text}")`);
    await link.click();
  }

  /**
   * Проверить наличие кнопки
   */
  async hasButton(text: string): Promise<boolean> {
    const button = this.page.locator(
      `button:has-text("${text}"), input[type="button"][value="${text}"], input[type="submit"][value="${text}"]`
    );
    return await button.isVisible();
  }

  /**
   * Кликнуть по кнопке
   */
  async clickButton(text: string): Promise<void> {
    const button = this.page.locator(
      `button:has-text("${text}"), input[type="button"][value="${text}"], input[type="submit"][value="${text}"]`
    );
    await button.click();
  }

  /**
   * Проверить наличие формы
   */
  async hasForm(): Promise<boolean> {
    return await this.isElementExists('form');
  }

  /**
   * Получить все формы на странице
   */
  async getForms(): Promise<Array<{ action: string; method: string; id: string }>> {
    const forms = this.page.locator('form');
    const count = await forms.count();
    const formData: Array<{ action: string; method: string; id: string }> = [];
    
    for (let i = 0; i < count; i++) {
      const form = forms.nth(i);
      const action = await form.getAttribute('action') || '';
      const method = await form.getAttribute('method') || 'get';
      const id = await form.getAttribute('id') || '';
      
      formData.push({ action, method, id });
    }
    
    return formData;
  }

  /**
   * Проверить наличие изображения
   */
  async hasImage(alt?: string, src?: string): Promise<boolean> {
    let selector = 'img';
    if (alt) selector += `[alt*="${alt}"]`;
    if (src) selector += `[src*="${src}"]`;
    
    return await this.isElementExists(selector);
  }

  /**
   * Получить все изображения на странице
   */
  async getImages(): Promise<Array<{ src: string; alt: string }>> {
    const images = this.page.locator('img');
    const count = await images.count();
    const imageData: Array<{ src: string; alt: string }> = [];
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src') || '';
      const alt = await img.getAttribute('alt') || '';
      
      imageData.push({ src, alt });
    }
    
    return imageData;
  }

  /**
   * Проверить наличие таблицы
   */
  async hasTable(): Promise<boolean> {
    return await this.isElementExists('table');
  }

  /**
   * Получить данные таблицы
   */
  async getTableData(): Promise<string[][]> {
    const table = this.page.locator('table');
    const rows = table.locator('tr');
    const rowCount = await rows.count();
    const tableData: string[][] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td, th');
      const cellCount = await cells.count();
      const rowData: string[] = [];
      
      for (let j = 0; j < cellCount; j++) {
        const cellText = await cells.nth(j).textContent();
        rowData.push(cellText || '');
      }
      
      tableData.push(rowData);
    }
    
    return tableData;
  }

  /**
   * Проверить наличие списка
   */
  async hasList(): Promise<boolean> {
    return await this.isElementExists('ul, ol');
  }

  /**
   * Получить элементы списка
   */
  async getListItems(): Promise<string[]> {
    const listItems = this.page.locator('li');
    const count = await listItems.count();
    const items: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const itemText = await listItems.nth(i).textContent();
      if (itemText) {
        items.push(itemText.trim());
      }
    }
    
    return items;
  }

  /**
   * Проверить наличие уведомления
   */
  async hasNotification(): Promise<boolean> {
    return await this.isElementExists('.notification, .alert, .toast, .snackbar');
  }

  /**
   * Получить текст уведомления
   */
  async getNotificationText(): Promise<string> {
    const notification = this.page.locator('.notification, .alert, .toast, .snackbar').first();
    return await notification.textContent() || '';
  }

  /**
   * Проверить наличие ошибки на странице
   */
  async hasError(): Promise<boolean> {
    return await this.isElementExists('.error, .alert-error, .form-error');
  }

  /**
   * Получить текст ошибки
   */
  async getErrorMessage(): Promise<string> {
    const error = this.page.locator('.error, .alert-error, .form-error').first();
    return await error.textContent() || '';
  }

  /**
   * Проверить наличие загрузки
   */
  async isLoading(): Promise<boolean> {
    return await this.isElementExists('.loading, .spinner, .loader, [data-loading="true"]');
  }

  /**
   * Дождаться завершения загрузки
   */
  async waitForLoadingComplete(): Promise<void> {
    await this.waitForElementToDisappear('.loading, .spinner, .loader, [data-loading="true"]');
  }

  /**
   * Сделать скриншот страницы
   */
  async takePageScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.componentName}-${Date.now()}`;
    return await this.takeScreenshot(screenshotName);
  }

  /**
   * Получить мета-информацию страницы
   */
  async getMetaInfo(): Promise<Record<string, string>> {
    const meta: Record<string, string> = {};
    
    const metaTags = this.page.locator('meta');
    const count = await metaTags.count();
    
    for (let i = 0; i < count; i++) {
      const metaTag = metaTags.nth(i);
      const name = await metaTag.getAttribute('name');
      const property = await metaTag.getAttribute('property');
      const content = await metaTag.getAttribute('content');
      
      if (content) {
        const key = name || property || `meta-${i}`;
        meta[key] = content;
      }
    }
    
    return meta;
  }

  /**
   * Проверить наличие табов на странице
   */
  async hasTabs(): Promise<boolean> {
    return await this.isElementExists('.tab-nav, .tabs, [role="tablist"]');
  }

  /**
   * Получить все табы на странице
   */
  async getTabs(): Promise<Array<{ text: string; isActive: boolean; index: number }>> {
    const tabs = this.page.locator('.tab-item, .tab, [role="tab"]');
    const count = await tabs.count();
    const tabData: Array<{ text: string; isActive: boolean; index: number }> = [];
    
    for (let i = 0; i < count; i++) {
      const tab = tabs.nth(i);
      const text = await tab.textContent() || '';
      const classAttr = await tab.getAttribute('class');
      const isActive = classAttr?.includes('active') || false;
      
      tabData.push({ text: text.trim(), isActive, index: i });
    }
    
    return tabData;
  }

  /**
   * Переключиться на таб по индексу
   */
  async switchToTabByIndex(index: number): Promise<void> {
    const tabs = this.page.locator('.tab-item, .tab, [role="tab"]');
    await tabs.nth(index).click();
    await this.page.waitForTimeout(500); // Пауза для переключения
  }

  /**
   * Переключиться на таб по тексту
   */
  async switchToTabByText(text: string): Promise<void> {
    const tab = this.page.locator('.tab-item, .tab, [role="tab"]').filter({ hasText: text });
    await tab.click();
    await this.page.waitForTimeout(500); // Пауза для переключения
  }

  /**
   * Проверить наличие карточек на странице
   */
  async hasCards(): Promise<boolean> {
    return await this.isElementExists('.card, .card-promotion, .card-item');
  }

  /**
   * Получить количество карточек
   */
  async getCardsCount(): Promise<number> {
    const cards = this.page.locator('.card, .card-promotion, .card-item');
    return await cards.count();
  }

  /**
   * Получить все карточки на странице
   */
  async getAllCards(): Promise<Array<{
    title: string;
    description: string;
    imageSrc: string;
    buttons: string[];
  }>> {
    const cards = this.page.locator('.card, .card-promotion, .card-item');
    const count = await cards.count();
    const cardData: Array<{
      title: string;
      description: string;
      imageSrc: string;
      buttons: string[];
    }> = [];
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      
      const title = await card.locator('.title, .card-title, h3, h4').first().textContent() || '';
      const description = await card.locator('.excerpt, .description, .content, p').first().textContent() || '';
      const imageSrc = await card.locator('img').first().getAttribute('src') || '';
      
      // Получаем все кнопки в карточке
      const buttons = card.locator('button, .btn');
      const buttonCount = await buttons.count();
      const buttonTexts: string[] = [];
      
      for (let j = 0; j < buttonCount; j++) {
        const buttonText = await buttons.nth(j).textContent();
        if (buttonText) {
          buttonTexts.push(buttonText.trim());
        }
      }
      
      cardData.push({
        title: title.trim(),
        description: description.trim(),
        imageSrc,
        buttons: buttonTexts
      });
    }
    
    return cardData;
  }

  /**
   * Найти карточку по названию
   */
  async findCardByTitle(title: string): Promise<Locator | null> {
    const cards = this.page.locator('.card, .card-promotion, .card-item');
    const count = await cards.count();
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const cardTitle = await card.locator('.title, .card-title, h3, h4').first().textContent();
      if (cardTitle?.includes(title)) {
        return card;
      }
    }
    
    return null;
  }

  /**
   * Кликнуть по кнопке в карточке
   */
  async clickButtonInCard(cardTitle: string, buttonText: string): Promise<void> {
    const card = await this.findCardByTitle(cardTitle);
    if (!card) {
      throw new Error(`Card with title "${cardTitle}" not found`);
    }
    
    const button = card.locator('button, .btn').filter({ hasText: buttonText });
    await button.click();
  }

  /**
   * Проверить наличие кнопки в карточке
   */
  async hasButtonInCard(cardTitle: string, buttonText: string): Promise<boolean> {
    const card = await this.findCardByTitle(cardTitle);
    if (!card) return false;
    
    const button = card.locator('button, .btn').filter({ hasText: buttonText });
    return await button.isVisible();
  }

  /**
   * Проверить наличие изображения в карточке
   */
  async hasImageInCard(cardTitle: string): Promise<boolean> {
    const card = await this.findCardByTitle(cardTitle);
    if (!card) return false;
    
    const image = card.locator('img');
    return await image.isVisible();
  }

  /**
   * Получить URL изображения в карточке
   */
  async getImageUrlInCard(cardTitle: string): Promise<string> {
    const card = await this.findCardByTitle(cardTitle);
    if (!card) return '';
    
    const image = card.locator('img');
    return await image.getAttribute('src') || '';
  }

  /**
   * Проверить наличие модального окна
   */
  async hasModal(modalName?: string): Promise<boolean> {
    if (modalName) {
      return await this.isElementExists(`.modal-${modalName}, [data-modal="${modalName}"]`);
    }
    return await this.isElementExists('.modal, [role="dialog"]');
  }

  /**
   * Дождаться появления модального окна
   */
  async waitForModal(modalName?: string, timeout: number = 5000): Promise<void> {
    if (modalName) {
      await this.page.waitForSelector(`.modal-${modalName}, [data-modal="${modalName}"]`, { timeout });
    } else {
      await this.page.waitForSelector('.modal, [role="dialog"]', { timeout });
    }
  }

  /**
   * Закрыть модальное окно
   */
  async closeModal(): Promise<void> {
    // Попробуем найти кнопку закрытия
    const closeButton = this.page.locator('.modal-close, .close, [aria-label="close"], [data-dismiss="modal"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      // Кликнем по backdrop или ESC
      await this.page.keyboard.press('Escape');
    }
  }

  /**
   * Проверить наличие уведомления с определенным текстом
   */
  async hasNotificationWithText(text: string): Promise<boolean> {
    const notification = this.page.locator('.notification, .alert, .toast, .snackbar').filter({ hasText: text });
    return await notification.isVisible();
  }

  /**
   * Дождаться исчезновения уведомления
   */
  async waitForNotificationToDisappear(timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector('.notification, .alert, .toast, .snackbar', { 
      state: 'hidden', 
      timeout 
    });
  }

  /**
   * Проверить наличие ошибки с определенным текстом
   */
  async hasErrorWithText(text: string): Promise<boolean> {
    const error = this.page.locator('.error, .alert-error, .form-error').filter({ hasText: text });
    return await error.isVisible();
  }

  /**
   * Получить все ошибки на странице
   */
  async getAllErrors(): Promise<string[]> {
    const errors = this.page.locator('.error, .alert-error, .form-error');
    const count = await errors.count();
    const errorTexts: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const errorText = await errors.nth(i).textContent();
      if (errorText) {
        errorTexts.push(errorText.trim());
      }
    }
    
    return errorTexts;
  }

  /**
   * Проверить, что страница полностью загружена
   */
  async isPageFullyLoaded(): Promise<boolean> {
    try {
      // Проверяем, что нет индикаторов загрузки
      const isLoading = await this.isLoading();
      if (isLoading) return false;
      
      // Проверяем, что основные элементы видимы
      const hasContent = await this.page.locator('body').isVisible();
      if (!hasContent) return false;
      
      // Проверяем, что нет ошибок загрузки
      const hasErrors = await this.hasError();
      if (hasErrors) return false;
      
      return true;
    } catch (error) {
      this.logError('Error checking if page is fully loaded', error);
      return false;
    }
  }

  /**
   * Получить статистику страницы
   */
  async getPageStatistics(): Promise<{
    title: string;
    url: string;
    headingsCount: number;
    linksCount: number;
    imagesCount: number;
    formsCount: number;
    buttonsCount: number;
    cardsCount: number;
    tabsCount: number;
  }> {
    const title = await this.getTitle();
    const url = this.getUrl();
    const headings = await this.getHeadings();
    const links = this.page.locator('a');
    const images = this.page.locator('img');
    const forms = this.page.locator('form');
    const buttons = this.page.locator('button, .btn');
    const cards = this.page.locator('.card, .card-promotion, .card-item');
    const tabs = this.page.locator('.tab-item, .tab, [role="tab"]');
    
    return {
      title,
      url,
      headingsCount: headings.length,
      linksCount: await links.count(),
      imagesCount: await images.count(),
      formsCount: await forms.count(),
      buttonsCount: await buttons.count(),
      cardsCount: await cards.count(),
      tabsCount: await tabs.count()
    };
  }
}