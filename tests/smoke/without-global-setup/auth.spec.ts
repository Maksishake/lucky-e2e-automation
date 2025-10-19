import { test } from '@playwright/test';
import { logger } from '@/core/logger';
import { UserService } from '@/services/user/user.service';
import { Environment } from '@/config/envirement';

test.describe('Авторизация', () => {
  let userService: UserService;
  test.beforeEach(async ({ page }) => {
    logger.testStart('Auth Tests', 'auth.spec.ts');
    userService = new UserService(page);
  });


  test('Проверка авторизации через email', async () => {

    await userService.loginWithEmail(Environment.UserEmail, Environment.UserPassword);

    logger.assertion('Sucseess auth with email', true, true, true);
  });

 
});
