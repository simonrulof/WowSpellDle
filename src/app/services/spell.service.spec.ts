import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpellService } from './spell.service';
import { Spell } from '../models/spell.model';

describe('SpellService', () => {
  let service: SpellService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpellService],
    });

    service = TestBed.inject(SpellService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getAllSpells', () => {
    it('should fetch all spells', () => {
      const mockSpells: Spell[] = [
        {
          id: 1,
          translations: {
            en: {
              name: 'Fireball',
              description: 'Launch a fireball',
              class: 'Mage',
              spec: 'Fire',
              school: 'Fire',
              useType: 'Damaging',
            },
            fr: {
              name: 'Boule de feu',
              description: 'Lancez une boule de feu',
              class: 'Mage',
              spec: 'Feu',
              school: 'Feu',
              useType: 'Dégâts',
            },
          },
          cooldown: 0,
        },
      ];

      service.getAllSpells().subscribe((spells) => {
        expect(spells.length).toBe(1);
        expect(spells[0].translations.en.name).toBe('Fireball');
      });

      const req = httpTestingController.expectOne('http://localhost:3000/spells');
      expect(req.request.method).toBe('GET');
      req.flush(mockSpells);
    });
  });

  describe('getSpellById', () => {
    it('should fetch a spell by id', () => {
      const mockSpell: Spell = {
        id: 1,
        translations: {
          en: {
            name: 'Fireball',
            description: 'Launch a fireball',
            class: 'Mage',
            spec: 'Fire',
            school: 'Fire',
            useType: 'Damaging',
          },
          fr: {
            name: 'Boule de feu',
            description: 'Lancez une boule de feu',
            class: 'Mage',
            spec: 'Feu',
            school: 'Feu',
            useType: 'Dégâts',
          },
        },
        cooldown: 0,
      };

      service.getSpellById(1).subscribe((spell) => {
        expect(spell).toEqual(mockSpell);
      });

      const req = httpTestingController.expectOne('http://localhost:3000/spells/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockSpell);
    });
  });

  describe('getDailySpellWithDetails', () => {
    it('should fetch daily spell with details', () => {
      const mockDailyEntry = [{ date: '2026-01-16', spellId: 1 }];
      const mockSpell: Spell = {
        id: 1,
        translations: {
          en: {
            name: 'Fireball',
            description: 'Launch a fireball',
            class: 'Mage',
            spec: 'Fire',
            school: 'Fire',
            useType: 'Damaging',
          },
          fr: {
            name: 'Boule de feu',
            description: 'Lancez une boule de feu',
            class: 'Mage',
            spec: 'Feu',
            school: 'Feu',
            useType: 'Dégâts',
          },
        },
        cooldown: 0,
      };

      service.getDailySpellWithDetails('2026-01-16').subscribe((spell) => {
        expect(spell).toEqual(mockSpell);
      });

      const req1 = httpTestingController.expectOne('http://localhost:3000/dailySpells?date=2026-01-16');
      expect(req1.request.method).toBe('GET');
      req1.flush(mockDailyEntry);

      const req2 = httpTestingController.expectOne('http://localhost:3000/spells/1');
      expect(req2.request.method).toBe('GET');
      req2.flush(mockSpell);
    });
  });
});
