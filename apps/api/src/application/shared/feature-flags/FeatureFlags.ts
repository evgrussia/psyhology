/**
 * Feature Flags для проекта
 * Позволяют включать/отключать функции без изменения кода
 */

/**
 * Проверяет включён ли feature flag
 */
export function isFeatureEnabled(featureName: string): boolean {
  const envVar = `FEATURE_${featureName.toUpperCase()}_ENABLED`;
  const value = process.env[envVar];

  // По умолчанию все feature флаги включены в dev/stage
  // В production требуется явное включение
  if (process.env.NODE_ENV === 'production') {
    return value === 'true';
  }

  return value !== 'false';
}

/**
 * Feature Flags
 */
export const FeatureFlags = {
  /**
   * FEAT-PLT-05: Audit Log
   * Запись критичных действий в audit log
   */
  AUDIT_LOG_ENABLED: isFeatureEnabled('audit_log'),

  /**
   * Другие feature flags можно добавлять здесь
   */
} as const;
