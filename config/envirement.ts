import 'dotenv/config';

export class Environment {
  public static get UserEmail(): string {
    return process.env.E2E_USER_EMAIL || 'justshmv@gmail.com';
  }
  public static get UserPassword(): string {
    return process.env.E2E_USER_PASSWORD || '12345678';
  }
}
