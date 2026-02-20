import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Spell } from '../models/spell.model';
import { environment } from '../../environment';

export interface GuessResponse {
  spell: number;
  class: number;
  spec: number;
  school: number;
  useType: number;
  cooldown: number;
}

export interface HintResponse {
  hintFr: string;
  hintEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class SpellService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Get all available spells
   */
  getAllSpells(): Observable<Spell[]> {
    return this.http.get<Spell[]>(`${this.apiUrl}/Spells/all`).pipe(
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
    return this.getAllSpells().pipe(
      map((spells) => spells.find((spell) => spell.id === id)),
      catchError((error) => {
        console.error(`Error fetching spell with id ${id}:`, error);
        return of(undefined);
      }),
    );
  }

  /**
   * Compare a guessed spell with the daily spell
   * @param spellId - The ID of the spell to compare
   * @param date - Optional date in format YYYY-MM-DD (for playing previous days)
   */
  compareSpell(spellId: number, date?: string): Observable<GuessResponse | undefined> {
    const endpoint = date 
      ? `${this.apiUrl}/Spells/guess/${spellId}/${date}`
      : `${this.apiUrl}/Spells/guess/${spellId}`;
      
    return this.http.get<GuessResponse>(endpoint).pipe(
      catchError((error) => {
        console.error(`Error comparing spell with id ${spellId}:`, error);
        return of(undefined);
      }),
    );
  }

  /**
   * Get a hint for the daily spell (first letter)
   * @param date - Optional date in format YYYY-MM-DD (for playing previous days)
   */
  getHint(date?: string): Observable<HintResponse | undefined> {
    const endpoint = date
      ? `${this.apiUrl}/Spells/getFirstHint/${date}`
      : `${this.apiUrl}/Spells/getFirstHint`;
      
    return this.http.get<HintResponse>(endpoint).pipe(
      catchError((error) => {
        console.error('Error fetching hint:', error);
        return of(undefined);
      }),
    );
  }

  /**
   * Get all dates that have spells available
   * @returns Array of date strings in format YYYY-MM-DD
   */
  getExistingDates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Spells/getExistingDates`).pipe(
      catchError((error) => {
        console.error('Error fetching existing dates:', error);
        return of([]);
      }),
    );
  }
}
