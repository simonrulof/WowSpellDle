import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Spell } from '../models/spell.model';

interface DailySpellEntry {
  date: string;
  spellId: number;
}

@Injectable({
  providedIn: 'root',
})
export class SpellService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  /**
   * Get all available spells
   */
  getAllSpells(): Observable<Spell[]> {
    return this.http.get<Spell[]>(`${this.apiUrl}/spells`).pipe(
      catchError((error) => {
        console.error('Error fetching spells:', error);
        return of([]);
      }),
    );
  }

  /**
   * Get a spell by ID
   */
  getSpellById(id: number): Observable<Spell | undefined> {
    return this.http.get<Spell>(`${this.apiUrl}/spells/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching spell with id ${id}:`, error);
        return of(undefined);
      }),
    );
  }

  /**
   * Get the daily spell entry for a specific date
   * @param date - Date in format YYYY-MM-DD
   */
  getDailySpellEntry(date: string): Observable<DailySpellEntry | undefined> {
    return this.http.get<DailySpellEntry[]>(`${this.apiUrl}/dailySpells?date=${date}`).pipe(
      map((results) => {
        if (results.length > 0) {
          return results[0];
        }
        return undefined;
      }),
      catchError((error) => {
        console.error('Error fetching daily spell entry:', error);
        return of(undefined);
      }),
    );
  }

  /**
   * Get the spell for today's daily challenge
   */
  getTodaysDailySpellEntry(): Observable<DailySpellEntry | undefined> {
    const today = this.getTodayDate();
    return this.getDailySpellEntry(today);
  }

  /**
   * Get the daily spell and its full details
   */
  getDailySpellWithDetails(date: string): Observable<Spell | undefined> {
    return this.getDailySpellEntry(date).pipe(
      switchMap((entry) => {
        if (!entry) {
          return of(undefined);
        }
        return this.getSpellById(entry.spellId);
      }),
    );
  }

  /**
   * Get today's daily spell with full details
   * If no entry exists for today, create one with a random spell not used in the last 5 days
   */
  getTodaysDailySpellWithDetails(): Observable<Spell | undefined> {
    const today = this.getTodayDate();
    return this.getDailySpellWithDetails(today).pipe(
      switchMap((spell) => {
        // If spell found for today, return it
        if (spell) {
          return of(spell);
        }
        // If no spell found, generate one
        return this.generateDailySpellForToday();
      }),
    );
  }

  /**
   * Generate a daily spell for today that hasn't been used in the last 5 days
   */
  private generateDailySpellForToday(): Observable<Spell | undefined> {
    return this.getAllSpells().pipe(
      switchMap((allSpells) => {
        return this.getLastFiveDaysSpells().pipe(
          switchMap((lastFiveDaysSpellIds) => {
            // Find spells not used in the last 5 days
            const availableSpells = allSpells.filter(
              (spell) => !lastFiveDaysSpellIds.includes(spell.id),
            );

            if (availableSpells.length === 0) {
              console.warn('No available spells for today, using random spell');
              // Fallback: use random spell if all are used
              const randomSpell = allSpells[Math.floor(Math.random() * allSpells.length)];
              return this.saveDailySpell(this.getTodayDate(), randomSpell.id).pipe(
                switchMap(() => of(randomSpell)),
              );
            }

            // Pick random spell from available ones
            const selectedSpell =
              availableSpells[Math.floor(Math.random() * availableSpells.length)];

            // Save it to database
            return this.saveDailySpell(this.getTodayDate(), selectedSpell.id).pipe(
              switchMap(() => of(selectedSpell)),
            );
          }),
        );
      }),
    );
  }

  /**
   * Get spell IDs used in the last 5 days
   */
  private getLastFiveDaysSpells(): Observable<number[]> {
    return this.getAllDailySpells().pipe(
      map((allDailySpells) => {
        const today = new Date();
        const lastFiveSpellIds: number[] = [];

        for (let i = 1; i <= 5; i++) {
          const dateToCheck = new Date(today);
          dateToCheck.setDate(dateToCheck.getDate() - i);
          const dateStr = this.formatDate(dateToCheck);

          const dailySpell = allDailySpells.find((entry) => entry.date === dateStr);
          if (dailySpell) {
            lastFiveSpellIds.push(dailySpell.spellId);
          }
        }

        return lastFiveSpellIds;
      }),
    );
  }

  /**
   * Save a daily spell entry to the database
   */
  private saveDailySpell(date: string, spellId: number): Observable<DailySpellEntry> {
    const entry: DailySpellEntry = { date, spellId };
    return this.http.post<DailySpellEntry>(`${this.apiUrl}/dailySpells`, entry).pipe(
      catchError((error) => {
        console.error('Error saving daily spell:', error);
        // Return the entry anyway so the game can continue
        return of(entry);
      }),
    );
  }

  /**
   * Format a date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get all daily spells
   */
  getAllDailySpells(): Observable<DailySpellEntry[]> {
    return this.http.get<DailySpellEntry[]>(`${this.apiUrl}/dailySpells`).pipe(
      catchError((error) => {
        console.error('Error fetching daily spells:', error);
        return of([]);
      }),
    );
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
