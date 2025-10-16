import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { UserService } from '@/services/user/user.service';
import { AuthModalComponent } from '@/components/modals/auth-modal';
import { RegistrationModalComponent } from '@/components/modals/registration-modal';
import { Environment } from '@config/envirement';
  

test.describe('Авторизация', () => {
  let userService: UserService;
  let authModal: AuthModalComponent;
  let registrationModal: RegistrationModalComponent;
  test.beforeEach(async ({ page }) => {
    logger.testStart('Auth Tests', 'auth.spec.ts');
    userService = new UserService(page);
    authModal = new AuthModalComponent(page);
    registrationModal = new RegistrationModalComponent(page);
  });

  test('Проверка инициализации сервисов', async () => {
    expect(userService).toBeDefined();
    expect(authModal).toBeDefined();
    expect(registrationModal).toBeDefined();
    logger.assertion('Services should be initialized', true, true, true);
  });

  test('Проверка методов модального окна авторизации', async () => {
    expect(typeof authModal.open).toBe('function');
    expect(typeof authModal.close).toBe('function');
    expect(typeof authModal.fillEmail).toBe('function');
    expect(typeof authModal.fillPassword).toBe('function');
    expect(typeof authModal.submitLogin).toBe('function');
    logger.assertion('Auth modal methods should be available', true, true, true);
  });

  test('Проверка методов модального окна регистрации', async () => {
    expect(typeof registrationModal.open).toBe('function');
    expect(typeof registrationModal.close).toBe('function');
    expect(typeof registrationModal.fillEmail).toBe('function');
    expect(typeof registrationModal.fillPassword).toBe('function');
    expect(typeof registrationModal.submitRegistration).toBe('function');
    logger.assertion('Registration modal methods should be available', true, true, true);
  });

  test('Проверка методов UserService', async () => {
    expect(typeof userService.authWithEmail).toBe('function');
    expect(typeof userService.authWithPhone).toBe('function');
    expect(typeof userService.registerWithEmail).toBe('function');
    expect(typeof userService.registerWithPhone).toBe('function');
    expect(typeof userService.isAuthenticated).toBe('function');
    logger.assertion('UserService methods should be available', true, true, true);
  });

  test('Проверка селекторов модальных окон', async () => {
    const authModalSelector = authModal.modalSelector;
    const registrationModalSelector = registrationModal.modalSelector;
    
    expect(authModalSelector).toBeDefined();
    expect(registrationModalSelector).toBeDefined();
    logger.assertion('Modal selectors should be defined', true, true, true);
  });

  test('Проверка авторизации через email', async () => {

    await userService.authWithEmail(Environment.UserEmail, Environment.UserPassword);

    logger.assertion('Sucseess auth with email', true, true, true);
  });

 
});
