import { Injectable, inject } from '@angular/core';
import { LocalizationService } from './localization.service';
import { Language } from '../models/spell.model';
import { computed } from '@angular/core';

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
   * All UI text translations - loaded from JSON file at build time
   */
  private translations: UITranslations = {
    'game.title': { en: 'WowSpellDle', fr: 'WowSpellDle' },
    'game.languageToggle': { en: 'EN', fr: 'FR' },
    'game.attempts': { en: 'Attempts:', fr: 'Tentatives :' },
    'game.youWon': { en: '🎉 You Won!', fr: '🎉 Vous avez gagné !' },
    'game.guessedIn': { en: 'You guessed it in', fr: 'Vous l\'avez deviné en' },
    'game.attempt': { en: 'attempt', fr: 'tentative' },
    'game.attempts.plural': { en: 'attempts', fr: 'tentatives' },
    'game.playAgain': { en: 'Play Again', fr: 'Rejouer' },
    'game.guessTheSpell': { en: 'Guess the spell:', fr: 'Devinez le sort :' },
    'game.spellNamePlaceholder': { en: 'Type a spell name...', fr: 'Tapez un nom de sort...' },
    'game.guess': { en: 'Guess', fr: 'Deviner' },
    'game.yourGuesses': { en: 'Your Guesses', fr: 'Vos suppositions' },
    'game.attempt.number': { en: 'Attempt', fr: 'Tentative' },
    'game.feedback.class': { en: 'Class:', fr: 'Classe :' },
    'game.feedback.spec': { en: 'Spec:', fr: 'Spécialisation :' },
    'game.feedback.school': { en: 'School:', fr: 'École :' },
    'game.feedback.type': { en: 'Type:', fr: 'Type :' },
    'game.feedback.cooldown': { en: 'Cooldown:', fr: 'Temps de recharge :' },
    'game.feedback.na': { en: 'N/A', fr: 'N/A' },
    'game.loading': { en: 'Loading today\'s spell...', fr: 'Chargement du sort du jour...' },
    'game.spellNotFound': { en: 'Spell not found. Please check the name and try again.', fr: 'Sort non trouvé. Veuillez vérifier le nom et réessayer.' },
    'example.title': { en: 'Spell Service Example', fr: 'Exemple de service de sorts' },
    'example.todaysSpell': { en: 'Today\'s Daily Spell', fr: 'Sort du jour' },
    'example.allSpells': { en: 'All Available Spells', fr: 'Tous les sorts disponibles' },
    'example.spellName': { en: 'Name:', fr: 'Nom :' },
    'example.class': { en: 'Class:', fr: 'Classe :' },
    'example.spec': { en: 'Spec:', fr: 'Spécialisation :' },
    'example.cooldown': { en: 'Cooldown:', fr: 'Temps de recharge :' },
    'example.type': { en: 'Type:', fr: 'Type :' },
    'example.school': { en: 'School:', fr: 'École :' },
    'example.description': { en: 'Description:', fr: 'Description :' },
    'example.loadingSpell': { en: 'Loading today\'s spell...', fr: 'Chargement du sort du jour...' },
    'example.loadingSpells': { en: 'Loading spells...', fr: 'Chargement des sorts...' },
    'example.noSpells': { en: 'No spells available', fr: 'Aucun sort disponible' },
  };

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
