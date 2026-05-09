/**
 * data.js
 * =====================================
 * - Fetches hero data from the API
 * - Holds the shared state object
 * - Provides all data accessor & helper functions
 *   (getValue, extractNumber, isMissing, displayValue)
 */

// ── Shared State ───────────────────────────────────────────
// All 3 files read and write this object to share information.

const state = {
  heroes: [],
  currentPage: 1,
  pageSize: 20,
  searchValue: '',
  sortColumn: 'name',
  sortDirection: 'asc',
};

// ── API Fetch ──────────────────────────────────────────────

const API_URL =
  'https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json';

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    state.heroes = data;
    render(); // defined in ui.js
  })
  .catch((err) => {
    console.error('Failed to load hero data:', err);
  });

// ── Data Accessor ──────────────────────────────────────────
// Maps a column key to the correct field inside a hero object.

function getValue(hero, column) {
  const map = {
    name: hero.name,
    fullName: hero.biography.fullName,
    intelligence: hero.powerstats.intelligence,
    strength: hero.powerstats.strength,
    speed: hero.powerstats.speed,
    durability: hero.powerstats.durability,
    power: hero.powerstats.power,
    combat: hero.powerstats.combat,
    race: hero.appearance.race,
    gender: hero.appearance.gender,
    height: hero.appearance.height[1],
    weight: hero.appearance.weight[1],
    placeOfBirth: hero.biography.placeOfBirth,
    alignment: hero.biography.alignment,
  };
  return map[column] ?? '';
}

// ── Helper Functions ───────────────────────────────────────

// Extracts the first number from a value.
// Handles plain numbers, "78 kg", "6'1"", etc.
function extractNumber(value) {
  if (typeof value === 'number') return value;
  const match = value.toString().match(/[\d.]+/);
  return match ? parseFloat(match[0]) : NaN;
}

// Returns true if a value should be treated as missing.
// Used by sort to always push missing values to the end.
function isMissing(value) {
  return value === null || value === undefined || value === '' || value === '-';
}

// Safe display: shows 0 as "0", turns null/undefined/empty into "-".
// Fixes the bug where (value || '-') hides legitimate 0 powerstats.
function displayValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  return value;
}
