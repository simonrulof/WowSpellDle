export type SchoolType = 'Physical' | 'Holy' | 'Fire' | 'Nature' | 'Frost' | 'Shadow' | 'Arcane';
export type UseType = 'Healing' | 'Damaging' | 'Utility' | 'Buff';
export type Language = 'en' | 'fr';

export interface SpellTranslations {
  en: {
    name: string;
    description: string;
    class: string;
    spec: string | null;
    school: string;
    useType: string;
  };
  fr: {
    name: string;
    description: string;
    class: string;
    spec: string | null;
    school: string;
    useType: string;
  };
}

export interface Spell {
  id: number;
  translations: SpellTranslations;
  cooldown: number; // in seconds
}

/**
 * Helper function to get the appropriate name and description for a spell
 * based on the selected language
 */
export function getSpellText(spell: Spell, language: Language) {
  if (!spell?.translations?.[language]) {
    console.warn(`Translation missing for spell ${spell?.id} in language ${language}`);
    return {
      name: 'Unknown',
      description: 'No description available',
      class: 'Unknown',
      spec: null,
      school: 'Unknown',
      useType: 'Unknown',
    };
  }
  return spell.translations[language];
}
