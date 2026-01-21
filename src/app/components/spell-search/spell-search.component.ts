import { Component, inject, ChangeDetectionStrategy, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SpellService } from '../../services/spell.service';
import { LocalizationService } from '../../services/localization.service';
import { IconService } from '../../services/icon.service';
import { UITranslationService } from '../../services/ui-translation.service';
import { Spell, getSpellText } from '../../models/spell.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-spell-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spell-search.component.html',
  styleUrl: './spell-search.component.scss',
})
export class SpellSearchComponent {
  private spellService = inject(SpellService);
  private localizationService = inject(LocalizationService);
  iconService = inject(IconService);
  uiTranslationService = inject(UITranslationService);

  // Input control
  searchInput = new FormControl('');

  // State
  private allSpells = signal<Spell[]>([]);
  private searchQuery = signal('');
  isOpen = signal(false);
  selectedIndex = signal<number>(-1); // -1 means no selection

  // Filtered spells based on search query
  filteredSpells = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];

    const language = this.localizationService.getLanguage();
    return this.allSpells().filter((spell) => {
      const spellText = getSpellText(spell, language);
      return spellText.name.toLowerCase().includes(query);
    });
  });

  // Output event when spell is selected
  spellSelected = output<Spell>();

  constructor() {
    // Load all spells on init
    this.spellService.getAllSpells().subscribe((spells) => {
      this.allSpells.set(spells);
    });

    // Handle search input changes
    this.searchInput.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.searchQuery.set(value || '');
        this.isOpen.set((value || '').length > 0);
      });
  }

  /**
   * Get spell name in current language
   */
  getSpellName(spell: Spell): string {
    const language = this.localizationService.getLanguage();
    return getSpellText(spell, language).name;
  }

  /**
   * Handle spell selection from dropdown
   */
  selectSpell(spell: Spell): void {
    this.spellSelected.emit(spell);
    // Reset selected index before clearing
    this.selectedIndex.set(-1);
    // Clear the search field after selection
    this.clearSearch();
  }

  /**
   * Clear the search
   */
  clearSearch(): void {
    this.searchInput.reset();
    this.isOpen.set(false);
  }

  /**
   * Check if input value matches a valid spell
   */
  isValidSpell(): boolean {
    const inputValue = this.searchInput.value?.trim().toLowerCase();
    if (!inputValue) return false;

    const language = this.localizationService.getLanguage();
    return this.allSpells().some((spell) => {
      const spellText = getSpellText(spell, language);
      return spellText.name.toLowerCase() === inputValue;
    });
  }

  /**
   * Get the selected spell object if valid
   */
  getSelectedSpell(): Spell | undefined {
    const inputValue = this.searchInput.value?.trim().toLowerCase();
    if (!inputValue) return undefined;

    const language = this.localizationService.getLanguage();
    return this.allSpells().find((spell) => {
      const spellText = getSpellText(spell, language);
      return spellText.name.toLowerCase() === inputValue;
    });
  }

  /**
   * Handle keyboard navigation and selection
   */
  onKeyDown(event: KeyboardEvent): void {
    const spellList = this.filteredSpells();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isOpen.set(true);
      const currentIndex = this.selectedIndex();
      const nextIndex = currentIndex + 1 < spellList.length ? currentIndex + 1 : 0;
      this.selectedIndex.set(nextIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.isOpen.set(true);
      const currentIndex = this.selectedIndex();
      const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : spellList.length - 1;
      this.selectedIndex.set(prevIndex);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (spellList.length > 0) {
        const indexToSelect = this.selectedIndex() >= 0 ? this.selectedIndex() : 0;
        this.selectSpell(spellList[indexToSelect]);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.isOpen.set(false);
      this.selectedIndex.set(-1);
    }
  }
}
