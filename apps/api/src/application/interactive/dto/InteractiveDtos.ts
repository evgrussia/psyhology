/**
 * DTO для запроса на запуск интерактива
 */
export interface StartInteractiveRunRequestDto {
  interactiveSlug: string;
  anonymousId?: string | null;
  userId?: string | null;
  topic?: string | null;
  entryPoint?: string | null;
}

/**
 * DTO для ответа на запуск интерактива
 */
export interface StartInteractiveRunResponseDto {
  runId: string;
}

/**
 * DTO для запроса на завершение интерактива
 */
export interface CompleteInteractiveRunRequestDto {
  runId: string;
  resultLevel?: 'low' | 'moderate' | 'high' | null;
  resultProfile?: string | null;
  durationMs?: number | null;
  crisisTriggered?: boolean;
  crisisTriggerType?: string | null;
}

/**
 * DTO для ответа на завершение интерактива
 */
export interface CompleteInteractiveRunResponseDto {
  success: boolean;
}
