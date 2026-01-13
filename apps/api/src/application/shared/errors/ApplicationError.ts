/**
 * Базовый класс для ошибок прикладного уровня (Application Layer)
 */
export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApplicationError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Ошибка аутентификации (неверные учётные данные)
 */
export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Invalid credentials') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Ошибка авторизации (нет прав)
 */
export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Ошибка валидации на уровне приложения
 */
export class ValidationError extends ApplicationError {
  constructor(
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Ошибка: ресурс не найден
 */
export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
