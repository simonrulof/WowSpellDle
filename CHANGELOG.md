# Changelog

All notable changes to the WowSpellDle project are documented here.

## [1.0.0] - January 2026

### 🎉 Initial Release

#### Features
- ✅ Daily spell guessing game with WoW theme
- ✅ Multilingual UI (English & French)
- ✅ Real-time feedback system
- ✅ Autocomplete spell search with keyboard navigation
- ✅ 8 World of Warcraft spells with full translations
- ✅ SVG spell icons for visual feedback
- ✅ Dark theme inspired by WoW UI

#### Components Added
- `GameComponent` - Main game interface
- `SpellSearchComponent` - Autocomplete spell selector with dropdown
- `AttemptsComponent` - Attempt counter display
- `SpellServiceExampleComponent` - Service usage example

#### Services Added
- `SpellService` - Spell data and feedback calculation
- `LocalizationService` - Language switching
- `UITranslationService` - UI text localization
- `IconService` - SVG icon path mapping

#### UI/UX Improvements
- ✨ World of Warcraft-inspired dark theme
- 🎨 Gold accents with bronze borders
- 🖱️ Keyboard navigation (arrow keys + Enter)
- 📱 Responsive design for mobile and desktop
- ⌨️ Dropdown spell selection with visual highlighting

#### Technical Stack
- Angular 21.1.0 with TypeScript 5.9.2
- Reactive Forms with FormControl
- Angular Signals for state management
- RxJS 7.8.0 for async operations
- SCSS for styling with component scoping
- json-server for mock API

#### Theme Implementation
- Color palette: Dark brown (#2d2a25), Gold (#ffd700), Bronze (#8b7355)
- Global styles for consistent look
- WoW-inspired UI patterns
- Dark dropdown with gold accents
- Hover effects and visual feedback

#### Keyboard Navigation
- ⬇️ Arrow Down - Next spell in dropdown
- ⬆️ Arrow Up - Previous spell in dropdown
- ↩️ Enter - Select highlighted spell
- Esc - Close dropdown

#### Icon System
- 8 WoW-themed SVG spell icons
- IconService for centralized path management
- Icons displayed in search dropdown and guess history

#### Game Mechanics
- Daily spell selection (different spell per day)
- Unlimited attempts to guess
- Feedback for: class, specialization, school, use type, cooldown
- Visual indicators (✓/✗ and ⬆️/⬇️) for feedback

#### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Clear visual feedback
- Multilingual support

### Mock Data
- 8 spells with full EN/FR translations:
  1. Fireball (Mage - Fire)
  2. Heal (Priest - Holy)
  3. Charge (Warrior - Protection)
  4. Shadow Bolt (Warlock - All)
  5. Power Word: Shield (Priest - Discipline)
  6. Frost Bolt (Mage - Frost)
  7. Rejuvenation (Druid - Restoration)
  8. Aimed Shot (Hunter - Marksmanship)

---

## Future Enhancements

### Planned Features
- [ ] Statistics tracking (games played, win rate, streak)
- [ ] Settings page (theme selection, animation preferences)
- [ ] Leaderboard with daily rankings
- [ ] More spells (50+ spells for variety)
- [ ] Difficulty levels (expert mode with fewer hints)
- [ ] Sound effects and animations
- [ ] PWA support for offline play
- [ ] Additional languages

### Performance Improvements
- [ ] Image optimization for icons
- [ ] Service worker for caching
- [ ] Code splitting for faster initial load
- [ ] Lazy loading for images

### Bug Fixes & Polish
- [ ] Better error handling
- [ ] Loading states
- [ ] Toast notifications
- [ ] Input sanitization

---

## Version History

### 1.0.0
- Initial release with core gameplay
- Autocomplete spell search
- Dark WoW-themed UI
- Multilingual support

---

**Last Updated:** January 21, 2026
