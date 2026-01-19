import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpellService } from '../../services/spell.service';
import { LocalizationService } from '../../services/localization.service';
import { UITranslationService } from '../../services/ui-translation.service';
import { Spell, getSpellText } from '../../models/spell.model';

/**
 * Example component showing how to use the SpellService with localization
 * 
 * This is a reference implementation for consuming the spell data service.
 * Can be used as a reference for building other components.
 */
@Component({
  selector: 'app-spell-service-example',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spell-service-example.component.html',
  styleUrl: './spell-service-example.component.scss',
})
export class SpellServiceExampleComponent {
  private spellService = inject(SpellService);
  localizationService = inject(LocalizationService);
  uiTranslationService = inject(UITranslationService);

  // Observable for today's daily spell
  todaysSpell$ = this.spellService.getTodaysDailySpellWithDetails();

  // Observable for all available spells
  allSpells$ = this.spellService.getAllSpells();

  /**
   * Get spell name in the current language
   */
  getSpellName(spell: Spell | null | undefined): string {
    if (!spell) {
      return 'Unknown Spell';
    }
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).name;
  }

  /**
   * Get spell description in the current language
   */
  getSpellDescription(spell: Spell | null | undefined): string {
    if (!spell) {
      return 'No description available';
    }
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).description;
  }

  /**
   * Get spell class in the current language
   */
  getSpellClass(spell: Spell | null | undefined): string {
    if (!spell) {
      return 'Unknown';
    }
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).class;
  }

  /**
   * Get spell spec in the current language
   */
  getSpellSpec(spell: Spell | null | undefined): string | null {
    if (!spell) {
      return null;
    }
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).spec;
  }

  /**
   * Get spell school in the current language
   */
  getSpellSchool(spell: Spell | null | undefined): string {
    if (!spell) {
      return 'Unknown';
    }
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).school;
  }

  /**
   * Get spell use type in the current language
   */
  getSpellUseType(spell: Spell | null | undefined): string {
    if (!spell) {
      return 'Unknown';
    }
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).useType;
  }
}

/**
 * Usage in your app:
 * 
 * 1. In a component template with async pipe:
 *    @if (spell$ | async; as spell) {
 *      <p>{{ getSpellName(spell) }}</p>
 *    }
 * 
 * 2. In a component class:
 *    constructor() {
 *      this.spellService.getTodaysDailySpellWithDetails().subscribe(spell => {
 *        console.log('Today\'s spell:', spell);
 *      });
 *    }
 * 
 * 3. Using signals:
 *    import { toSignal } from '@angular/core/rxjs-interop';
 *    
 *    spell = toSignal(this.spellService.getTodaysDailySpellWithDetails());
 * 
 * 4. Using localization:
 *    localizationService = inject(LocalizationService);
 *    
 *    // Get current language
 *    currentLang = this.localizationService.getLanguage();
 *    
 *    // Set language
 *    this.localizationService.setLanguage('fr');
 *    
 *    // Toggle language
 *    this.localizationService.toggleLanguage();
 */
