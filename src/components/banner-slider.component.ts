/**
 * Banner Slider Component - Компонент баннерного слайдера
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../core/base.component';
import { BannerSlide, SliderState } from '../types/game.types';

export class BannerSliderComponent extends BaseComponent {
  // Селекторы для элементов слайдера
  get sliderContainer(): Locator {
    return this.page.locator('.banner-slider');
  }
  
  get sliderTrack(): Locator {
    return this.page.locator('.splide__track');
  }
  
  get sliderList(): Locator {
    return this.page.locator('.splide__list');
  }
  
  get slide(): Locator {
    return this.page.locator('.splide__slide');
  }
  
  get activeSlide(): Locator {
    return this.page.locator('.splide__slide.is-active');
  }
  
  get visibleSlide(): Locator {
    return this.page.locator('.splide__slide.is-visible');
  }
  
  get nextButton(): Locator {
    return this.page.locator('.splide__arrow--next');
  }
  
  get prevButton(): Locator {
    return this.page.locator('.splide__arrow--prev');
  }
  
  get bannerImage(): Locator {
    return this.page.locator('.banner img');
  }
  
  get bannerLink(): Locator {
    return this.page.locator('.banner a');
  }

  constructor(page: Page) {
    super(page, 'BannerSlider');
  }

  /**
   * Проверить, виден ли слайдер
   */
  async isSliderVisible(): Promise<boolean> {
    return await this.isVisible();
  }

  /**
   * Получить количество слайдов
   */
  async getSlidesCount(): Promise<number> {
    return await this.slide.count();
  }

  /**
   * Получить активный слайд
   */
  async getActiveSlide(): Promise<number> {
    const count = await this.activeSlide.count();
    return count > 0 ? 0 : -1; // Возвращаем индекс первого активного слайда
  }

  /**
   * Получить видимые слайды
   */
  async getVisibleSlides(): Promise<number> {
    return await this.visibleSlide.count();
  }

  /**
   * Перейти к следующему слайду
   */
  async goToNextSlide(): Promise<void> {
    this.logStep('Going to next slide');
    await this.nextButton.click();
    await this.page.waitForTimeout(500); // Ждем анимацию
    this.logSuccess('Moved to next slide');
  }

  /**
   * Перейти к предыдущему слайду
   */
  async goToPreviousSlide(): Promise<void> {
    this.logStep('Going to previous slide');
    await this.prevButton.click();
    await this.page.waitForTimeout(500); // Ждем анимацию
    this.logSuccess('Moved to previous slide');
  }

  /**
   * Перейти к конкретному слайду по индексу
   */
  async goToSlide(index: number): Promise<void> {
    this.logStep(`Going to slide ${index}`);
    const slide = this.slide.nth(index);
    await slide.click();
    await this.page.waitForTimeout(500);
    this.logSuccess(`Moved to slide ${index}`);
  }

  /**
   * Получить информацию о слайде по индексу
   */
  async getSlideInfo(index: number): Promise<BannerSlide> {
    const slide = this.slide.nth(index);
    const banner = slide.locator('.banner');
    const link = banner.locator('a');
    const image = banner.locator('img');
    
    const title = await image.getAttribute('alt') || '';
    const imageUrl = await image.getAttribute('src') || '';
    const gameUrl = await link.getAttribute('href') || '';
    const isActive = await slide.locator('.is-active').count() > 0;

    return {
      id: `slide-${index}`,
      title,
      imageUrl,
      gameUrl,
      isActive
    };
  }

  /**
   * Получить все слайды
   */
  async getAllSlides(): Promise<BannerSlide[]> {
    const slidesCount = await this.getSlidesCount();
    const slides: BannerSlide[] = [];

    for (let i = 0; i < slidesCount; i++) {
      const slideInfo = await this.getSlideInfo(i);
      slides.push(slideInfo);
    }

    return slides;
  }

  /**
   * Кликнуть по активному слайду
   */
  async clickActiveSlide(): Promise<void> {
    this.logStep('Clicking active slide');
    const activeSlide = this.activeSlide.first();
    const link = activeSlide.locator(this.bannerLink);
    await link.click();
    this.logSuccess('Clicked active slide');
  }

  /**
   * Кликнуть по слайду по индексу
   */
  async clickSlide(index: number): Promise<void> {
    this.logStep(`Clicking slide ${index}`);
    const slide = this.slide.nth(index);
    const link = slide.locator(this.bannerLink);
    await link.click();
    this.logSuccess(`Clicked slide ${index}`);
  }

  /**
   * Проверить, активен ли слайдер
   */
  async isSliderActive(): Promise<boolean> {
    return await this.sliderContainer.locator('.is-active').count() > 0;
  }

  /**
   * Получить состояние слайдера
   */
  async getSliderState(): Promise<SliderState> {
    const currentSlide = await this.getActiveSlide();
    const totalSlides = await this.getSlidesCount();
    const isAutoPlay = await this.page.locator('.splide--loop').count() > 0;
    const isDragging = await this.page.locator('.splide--draggable').count() > 0;

    return {
      currentSlide,
      totalSlides,
      isAutoPlay,
      isDragging
    };
  }

  /**
   * Дождаться загрузки слайдера
   */
  async waitForSliderLoad(): Promise<void> {
    this.logStep('Waiting for slider to load');
    await this.sliderContainer.waitFor({ state: 'visible' });
    await this.slide.waitFor({ state: 'visible' });
    this.logSuccess('Slider loaded');
  }

  /**
   * Проверить, есть ли кнопки навигации
   */
  async hasNavigationButtons(): Promise<boolean> {
    const nextVisible = await this.nextButton.isVisible();
    const prevVisible = await this.prevButton.isVisible();
    
    return nextVisible && prevVisible;
  }

  /**
   * Проверить, активна ли кнопка "Следующий"
   */
  async isNextButtonEnabled(): Promise<boolean> {
    const isDisabled = await this.nextButton.getAttribute('disabled');
    return !isDisabled;
  }

  /**
   * Проверить, активна ли кнопка "Предыдущий"
   */
  async isPrevButtonEnabled(): Promise<boolean> {
    const isDisabled = await this.prevButton.getAttribute('disabled');
    return !isDisabled;
  }
}
