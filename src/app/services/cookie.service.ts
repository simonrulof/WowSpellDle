import { Injectable, signal } from '@angular/core';

export interface GameState {
  date: string;
  guesses: number[];
  won: boolean;
  hintUsed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private readonly COOKIE_CONSENT_KEY = 'wowspelldle_cookie_consent';
  private readonly GAME_STATE_PREFIX = 'wowspelldle_game_';

  // Signal for cookie consent state
  cookieConsentGiven = signal<boolean | null>(this.getCookieConsent());

  /**
   * Check if cookie consent has been given
   */
  private getCookieConsent(): boolean | null {
    const consent = localStorage.getItem(this.COOKIE_CONSENT_KEY);
    if (consent === null) return null;
    return consent === 'true';
  }

  /**
   * Set cookie consent
   */
  setCookieConsent(consent: boolean): void {
    localStorage.setItem(this.COOKIE_CONSENT_KEY, consent.toString());
    this.cookieConsentGiven.set(consent);
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

  /**
   * Save game state for a specific date
   */
  saveGameState(state: GameState): void {
    if (!this.cookieConsentGiven()) return;

    const key = `${this.GAME_STATE_PREFIX}${state.date}`;
    localStorage.setItem(key, JSON.stringify(state));
  }

  /**
   * Load game state for today
   */
  loadTodaysGameState(): GameState | null {
    if (!this.cookieConsentGiven()) return null;

    const today = this.getTodayDate();
    const key = `${this.GAME_STATE_PREFIX}${today}`;
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    try {
      return JSON.parse(stored) as GameState;
    } catch (error) {
      console.error('Error parsing game state:', error);
      return null;
    }
  }

  /**
   * Load game state for a specific date
   */
  loadGameState(date: string): GameState | null {
    if (!this.cookieConsentGiven()) return null;

    const key = `${this.GAME_STATE_PREFIX}${date}`;
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    try {
      return JSON.parse(stored) as GameState;
    } catch (error) {
      console.error('Error parsing game state:', error);
      return null;
    }
  }

  /**
   * Clear all game states (for testing or user request)
   */
  clearAllGameStates(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.GAME_STATE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  /**
   * Get total games played
   */
  getTotalGamesPlayed(): number {
    if (!this.cookieConsentGiven()) return 0;

    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.GAME_STATE_PREFIX)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Get win rate
   */
  getWinRate(): number {
    if (!this.cookieConsentGiven()) return 0;

    let totalGames = 0;
    let wins = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.GAME_STATE_PREFIX)) {
        totalGames++;
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const state = JSON.parse(stored) as GameState;
            if (state.won) wins++;
          } catch (error) {
            console.error('Error parsing game state:', error);
          }
        }
      }
    }

    return totalGames > 0 ? (wins / totalGames) * 100 : 0;
  }
}
