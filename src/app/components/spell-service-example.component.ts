import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpellService } from '../services/spell.service';
import { LocalizationService } from '../services/localization.service';
import { Spell, getSpellText } from '../models/spell.model';

/**
 * Example component showing how to use the SpellService with localization
 * 
 * This is a reference implementation for consuming the spell data service.
 * Remove this file once you create your actual game component.
 */
@Component({
  selector: 'app-spell-service-example',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="spell-service-example">
      <div class="header">
        <h1>Spell Service Example</h1>
        <button (click)="localizationService.toggleLanguage()" class="language-toggle">
          {{ localizationService.getLanguageDisplayName(localizationService.getLanguage()) }}
        </button>
      </div>

      <!-- Today's Daily Spell -->
      <section>
        <h2>Today's Daily Spell</h2>
        @if (todaysSpell$ | async; as spell) {
          <div class="spell-card">
            <h3>{{ getSpellName(spell) }}</h3>
            <p><strong>Class:</strong> {{ getSpellClass(spell) }}</p>
            <p><strong>Spec:</strong> {{ getSpellSpec(spell) || 'N/A' }}</p>
            <p><strong>Cooldown:</strong> {{ spell.cooldown }}s</p>
            <p><strong>Type:</strong> {{ getSpellUseType(spell) }}</p>
            <p><strong>School:</strong> {{ getSpellSchool(spell) }}</p>
            <p><strong>Description:</strong> {{ getSpellDescription(spell) }}</p>
          </div>
        } @else {
          <p>Loading today's spell...</p>
        }
      </section>

      <!-- All Available Spells -->
      <section>
        <h2>All Available Spells</h2>
        @if (allSpells$ | async; as spells) {
          @if (spells.length > 0) {
            <div class="spells-list">
              @for (spell of spells; track spell.id) {
                <div class="spell-item">
                  <strong>{{ getSpellName(spell) }}</strong> ({{ getSpellClass(spell) }})
                </div>
              }
            </div>
          } @else {
            <p>No spells available</p>
          }
        } @else {
          <p>Loading spells...</p>
        }
      </section>
    </div>
  `,
  styles: `
    .spell-service-example {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      gap: 20px;
    }

    .header h1 {
      margin: 0;
    }

    .language-toggle {
      padding: 8px 16px;
      border: 2px solid #333;
      border-radius: 4px;
      background-color: #f0f0f0;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    }

    .language-toggle:hover {
      background-color: #e0e0e0;
      transform: scale(1.05);
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      border-bottom: 2px solid #ccc;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .spell-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background-color: #f9f9f9;
    }

    .spell-card h3 {
      margin-top: 0;
      color: #333;
    }

    .spell-card p {
      margin: 8px 0;
      font-size: 14px;
    }

    .spells-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
    }

    .spell-item {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f0f0f0;
      font-size: 14px;
    }
  `,
})
export class SpellServiceExampleComponent {
  private spellService = inject(SpellService);
  localizationService = inject(LocalizationService);

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
