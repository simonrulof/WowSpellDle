import { Injectable, inject } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Language } from '../models/spell.model';
import { computed } from '@angular/core';
import uiTranslationsData from '../../assets/ui-translations.json';

/**
 * UI translations for all component labels, buttons, messages, and placeholders
 */
export interface UITranslations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UITranslationService {
  private localizationService = inject(LocalizationService);

  /**
   * All UI text translations - loaded from JSON file
   */
  private translations: UITranslations = uiTranslationsData;

  /**
   * Get UI text translation for current language
   */
  getText(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    const language = this.localizationService.getLanguage();
    return translation[language] || translation.en;
  }

  /**
   * Get reactive signal for UI text (updates when language changes)
   */
  getTextSignal(key: string) {
    return computed(() => this.getText(key));
  }

  /**
   * Get all translations for a section
   */
  getSection(sectionPrefix: string): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    const language = this.localizationService.getLanguage();

    Object.entries(this.translations).forEach(([key, value]) => {
      if (key.startsWith(sectionPrefix)) {
        const shortKey = key.replace(sectionPrefix + '.', '');
        result[shortKey] = value[language] || value.en;
      }
    });

    return result;
  }

  /**
   * Get language display name
   */
  getLanguageDisplayName(language: Language): string {
    return language === 'en' ? '🇬🇧 EN' : '🇫🇷 FR';
  }
}
