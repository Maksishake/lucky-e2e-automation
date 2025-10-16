/**
 * Типы для авторизации и регистрации
 */

/**
 * Данные для входа
 */
export interface AuthCredentials {
  email?: string;
  phone?: string;
  password: string;
}

/**
 * Данные для регистрации
 */
export interface RegistrationData {
  email?: string;
  phone?: string;
  password: string;
  promocode?: string;
  currency?: string;
  condition: boolean;
  country?: string;
}

/**
 * Ответ от API авторизации
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: UserData;
  error?: AuthError;
}

/**
 * Данные пользователя
 */
export interface UserData {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  balance?: number;
  currency?: string;
  verified?: boolean;
}

/**
 * Данные SMS кода
 */
export interface SmsCodeData {
  code: string;
  phone: string;
  expiresAt?: Date;
}

/**
 * Провайдер социальной авторизации
 */
export interface SocialAuthProvider {
  name: string;
  url: string;
  icon: string;
}

/**
 * Код страны
 */
export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

/**
 * Состояние модального окна авторизации
 */
export interface AuthModalState {
  activeTab: 'signup' | 'login';
  signupMethod: 'email' | 'phone';
  loginMethod: 'email' | 'phone';
  showConfirmationForm: boolean;
  selectedCountry?: string;
  selectedCurrency?: string;
}

/**
 * Валидация формы
 */
export interface FormValidation {
  email?: boolean;
  phone?: boolean;
  password: boolean;
  condition: boolean;
}

/**
 * Ошибка авторизации
 */
export interface AuthError {
  field?: string;
  message: string;
  code: string;
}

/**
 * Типы провайдеров социальных сетей
 */
export type SocialProvider = 'google';

/**
 * Типы валют
 */
export type Currency = 'UAH' | 'USD' | 'EUR' | 'RUB' | 'KZT' | 'BYN';

/**
 * Типы ошибок авторизации
 */
/*export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  INVALID_EMAIL = 'invalid_email',
  INVALID_PHONE = 'invalid_phone',
  WEAK_PASSWORD = 'weak_password',
  TERMS_NOT_ACCEPTED = 'terms_not_accepted',
  USER_EXISTS = 'user_exists',
  USER_NOT_FOUND = 'user_not_found',
  INVALID_SMS_CODE = 'invalid_sms_code',
  SMS_EXPIRED = 'sms_expired',
  TOO_MANY_ATTEMPTS = 'too_many_attempts',
  NETWORK_ERROR = 'network_error',
  UNKNOWN_ERROR = 'чекбокс согласия с правилами сайта'
The condition must be accepted.
не выбрана валюта
The currency field is required.
пароль
The password field is required.
телефон
Invalid phone number format.
The selected full phone is invalid.
почта
The email field is required.
The login email must be a valid email address.
The selected login email is invalid.
регистрация занятого телефона/почты
The email has already been taken.
The phone has already been taken.
неверный пароль
These credentials do not match our records.'*/


