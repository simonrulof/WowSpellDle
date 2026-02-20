import { Component, inject, ChangeDetectionStrategy, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpellService } from '../../services/spell.service';
import { UITranslationService } from '../../services/ui-translation.service';
import { LocalizationService } from '../../services/localization.service';
import { CookieService } from '../../services/cookie.service';

interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-31
  isCurrentMonth: boolean;
  isToday: boolean;
  hasSpell: boolean;
  hasPlayed: boolean;
  won: boolean;
  isPastDate: boolean;
  guessCount?: number; // Number of guesses made
}

interface CalendarMonth {
  year: number;
  month: number; // 0-11
  monthName: string;
  weeks: CalendarDay[][];
}

@Component({
  selector: 'app-archive',
  imports: [CommonModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveComponent {
  private spellService = inject(SpellService);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private localizationService = inject(LocalizationService);
  uiTranslationService = inject(UITranslationService);

  currentMonth = signal<CalendarMonth | null>(null);
  isLoading = signal<boolean>(true);
  private existingDatesSet = signal<Set<string>>(new Set());

  // Track current displayed month
  private displayedDate = signal<Date>(new Date());

  constructor() {
    this.loadExistingDates();
    
    // Regenerate calendar when language changes
    effect(() => {
      // Track language changes
      this.localizationService.currentLanguage();
      // Regenerate calendar if it's already loaded (using untracked to avoid infinite loop)
      if (untracked(() => this.currentMonth())) {
        untracked(() => this.generateCalendar());
      }
    });
  }

  /**
   * Load all existing dates from API
   */
  private loadExistingDates(): void {
    this.spellService.getExistingDates().subscribe((existingDates) => {
      this.existingDatesSet.set(new Set(existingDates));
      this.generateCalendar();
      this.isLoading.set(false);
    });
  }

  /**
   * Generate calendar for the current displayed month
   */
  private generateCalendar(): void {
    const date = this.displayedDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get current language for month formatting
    const language = this.localizationService.getLanguage();
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    const monthName = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    
    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week for first day (0 = Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Get days in month
    const daysInMonth = lastDay.getDate();
    
    // Get days from previous month to fill first week
    const previousMonth = new Date(year, month, 0);
    const daysInPreviousMonth = previousMonth.getDate();
    
    const weeks: CalendarDay[][] = [];
    let currentWeek: CalendarDay[] = [];
    
    const today = new Date();
    const todayStr = this.formatDate(today);
    
    // Fill first week with days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNumber = daysInPreviousMonth - i;
      const dayDate = new Date(year, month - 1, dayNumber);
      currentWeek.push(this.createCalendarDay(dayDate, false, todayStr));
    }
    
    // Fill current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      currentWeek.push(this.createCalendarDay(dayDate, true, todayStr));
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill last week with days from next month
    if (currentWeek.length > 0) {
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        const dayDate = new Date(year, month + 1, nextMonthDay);
        currentWeek.push(this.createCalendarDay(dayDate, false, todayStr));
        nextMonthDay++;
      }
      weeks.push(currentWeek);
    }
    
    this.currentMonth.set({
      year,
      month,
      monthName,
      weeks,
    });
  }

  /**
   * Create a calendar day object
   */
  private createCalendarDay(date: Date, isCurrentMonth: boolean, todayStr: string): CalendarDay {
    const dateStr = this.formatDate(date);
    const existingDates = this.existingDatesSet();
    const hasSpell = existingDates.has(dateStr);
    
    let hasPlayed = false;
    let won = false;
    let guessCount: number | undefined = undefined;
    
    if (hasSpell) {
      const gameState = this.cookieService.loadGameState(dateStr);
      // Only mark as played if there's at least one guess
      hasPlayed = gameState !== null && gameState.guesses.length > 0;
      won = gameState?.won || false;
      guessCount = gameState?.guesses.length;
    }
    
    const isPastDate = date < new Date(todayStr);
    
    return {
      date: dateStr,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isToday: dateStr === todayStr,
      hasSpell,
      hasPlayed,
      won,
      isPastDate,
      guessCount,
    };
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Navigate to previous month
   */
  previousMonth(): void {
    const current = this.displayedDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.displayedDate.set(newDate);
    this.generateCalendar();
  }

  /**
   * Navigate to next month
   */
  nextMonth(): void {
    const current = this.displayedDate();
    const newDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.displayedDate.set(newDate);
    this.generateCalendar();
  }

  /**
   * Check if next month button should be disabled (can't go beyond current month)
   */
  canGoToNextMonth(): boolean {
    const current = this.displayedDate();
    const today = new Date();
    return current.getMonth() < today.getMonth() || current.getFullYear() < today.getFullYear();
  }

  /**
   * Navigate to game page with selected date
   */
  playDate(day: CalendarDay): void {
    if (!day.hasSpell || day.isToday || !day.isPastDate) return;
    this.router.navigate(['/game', day.date]);
  }

  /**
   * Navigate back to today's game
   */
  goToToday(): void {
    this.router.navigate(['/']);
  }

  /**
   * Get day names for calendar header
   */
  getDayNames(): string[] {
    return [
      this.uiTranslationService.getText('calendar.sunday'),
      this.uiTranslationService.getText('calendar.monday'),
      this.uiTranslationService.getText('calendar.tuesday'),
      this.uiTranslationService.getText('calendar.wednesday'),
      this.uiTranslationService.getText('calendar.thursday'),
      this.uiTranslationService.getText('calendar.friday'),
      this.uiTranslationService.getText('calendar.saturday'),
    ];
  }
}
