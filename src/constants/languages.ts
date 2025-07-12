/**
 * Supported languages for internationalization
 */
export const SUPPORTED_LANGUAGES = ['de', 'en', 'es', 'fr', 'ja', 'ko', 'pt'] as const;

/**
 * Type for supported language codes
 */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Default language for the application
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
