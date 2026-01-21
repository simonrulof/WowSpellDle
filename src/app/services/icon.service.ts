import { Injectable } from '@angular/core';
import { Spell, getSpellText } from '../models/spell.model';
import { Language } from '../models/spell.model';

/**
 * IconService - Maps World of Warcraft spells to their SVG icon files
 */
@Injectable({
  providedIn: 'root',
})
export class IconService {
  /**
   * Map of spell names to their SVG icon file paths
   * Both English and French spell names are supported
   */
  private spellIconMap: Record<string, string> = {
    // English spell names
    'fireball': '/assets/spell-icons/fireball.svg',
    'heal': '/assets/spell-icons/heal.svg',
    'charge': '/assets/spell-icons/charge.svg',
    'shadow bolt': '/assets/spell-icons/shadow-bolt.svg',
    'power word: shield': '/assets/spell-icons/shield.svg',
    'frost bolt': '/assets/spell-icons/frost-bolt.svg',
    'rejuvenation': '/assets/spell-icons/rejuvenation.svg',
    'aimed shot': '/assets/spell-icons/aimed-shot.svg',
    // French spell names
    'boule de feu': '/assets/spell-icons/fireball.svg',
    'guérison': '/assets/spell-icons/heal.svg',
    'mot du pouvoir : bouclier': '/assets/spell-icons/shield.svg',
    'trait de givre': '/assets/spell-icons/frost-bolt.svg',
    'rajeunissement': '/assets/spell-icons/rejuvenation.svg',
    'trait de l\'ombre': '/assets/spell-icons/shadow-bolt.svg',
    'tir de visée': '/assets/spell-icons/aimed-shot.svg',
  };

  /**
   * Get the SVG path for a spell icon based on spell name
   * @param spellName - The name of the spell (EN or FR)
   * @returns The path to the SVG icon file, or empty string if not found
   */
  getSpellIcon(spellName: string): string {
    if (!spellName) return '';
    const normalizedName = spellName.toLowerCase().trim();
    return this.spellIconMap[normalizedName] || '';
  }

  /**
   * Get the SVG path for a spell icon based on Spell object
   * @param spell - The spell object
   * @param language - The current language (EN or FR)
   * @returns The path to the SVG icon file, or empty string if not found
   */
  getSpellIconFromSpell(spell: Spell, language: Language): string {
    if (!spell) return '';
    const spellText = getSpellText(spell, language);
    return this.getSpellIcon(spellText.name);
  }
}
