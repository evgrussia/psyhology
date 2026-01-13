/**
 * DTO для запроса входа в админку
 */
export interface AdminLoginRequestDto {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * DTO для ответа на вход
 */
export interface AuthResponseDto {
  user: UserDto;
  sessionId: string;
  expiresAt: Date;
}

/**
 * DTO пользователя
 */
export interface UserDto {
  id: string;
  email: string | null;
  displayName: string | null;
  roles: string[];
  isAdmin: boolean;
}

/**
 * DTO для запроса выхода
 */
export interface LogoutRequestDto {
  sessionId: string;
}

/**
 * DTO для текущего пользователя
 */
export interface CurrentUserRequestDto {
  sessionId: string;
}
