import { Injectable, signal } from '@angular/core';
import { Language } from '../models/spell.model';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private readonly LANGUAGE_STORAGE_KEY = 'wowSpellDle_language';
  private readonly DEFAULT_LANGUAGE: Language = 'en';

  // Signal to track the current language
  currentLanguage = signal<Language>(this.getInitialLanguage());

  constructor() {
    // Initialize from stored preference or browser locale
    const storedLanguage = this.getStoredLanguage();
    if (storedLanguage) {
      this.currentLanguage.set(storedLanguage);
    }
  }

  /**
   * Get the initial language based on stored preference or browser locale
   */
  private getInitialLanguage(): Language {
    const stored = this.getStoredLanguage();
    if (stored) {
      return stored;
    }

    return this.detectBrowserLanguage();
  }

  /**
   * Detect the browser's language preference
   */
  private detectBrowserLanguage(): Language {
    const browserLanguage = navigator.language.toLowerCase();

    // Check if browser language is French
    if (browserLanguage.startsWith('fr')) {
      return 'fr';
    }

    // Default to English for all other languages
    return 'en';
  }

  /**
   * Get the stored language preference from localStorage
   */
  private getStoredLanguage(): Language | null {
    const stored = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') {
      return stored;
    }
    return null;
  }

  /**
   * Set the current language
   */
  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    localStorage.setItem(this.LANGUAGE_STORAGE_KEY, language);
  }

  /**
   * Get the current language
   */
  getLanguage(): Language {
    return this.currentLanguage();
  }

  /**
   * Toggle between English and French
   */
  toggleLanguage(): void {
    const current = this.currentLanguage();
    const newLanguage: Language = current === 'en' ? 'fr' : 'en';
    this.setLanguage(newLanguage);
  }

  /**
   * Get language display name
   */
  getLanguageDisplayName(language: Language): string {
    return language === 'en' ? 'English' : 'Français';
  }
}
