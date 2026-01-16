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
   */
  getTodaysDailySpellWithDetails(): Observable<Spell | undefined> {
    const today = this.getTodayDate();
    return this.getDailySpellWithDetails(today);
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
