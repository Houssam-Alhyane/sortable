/**
 * data.js — Person 1's responsibility
 * =====================================
 * - state object (shared by all files)
 * - fetch from API
 * - getValue, getMetric, extractNumber, isMissing, displayValue
 */

const state = {
  heroes: [],
  currentPage: 1,
  pageSize: 20,
  searchValue: '',
  searchField: 'name',
  searchOp: 'include',
  sortColumn: 'name',
  sortDirection: 'asc',
  openHeroId: null,
};

const API_URL =
  'https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json';

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    state.heroes = data;
    readURL(); // restore state from URL first
    render(); // defined in ui.js
  })
  .catch((err) => console.error('Failed to load hero data:', err));

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
    height: getMetric(hero.appearance.height),
    weight: getMetric(hero.appearance.weight),
    placeOfBirth: hero.biography.placeOfBirth,
    alignment: hero.biography.alignment,
  };
  const val = map[column];
  return val === null || val === undefined ? '' : val;
}

function getMetric(pair) {
  const imperial = pair[0];
  const metric = pair[1];
  if (
    !imperial ||
    imperial.trim() === '-' ||
    /^-\s*(lb|kg|cm)?$/.test(imperial.trim())
  )
    return '';
  return metric;
}

function extractNumber(value) {
  if (typeof value === 'number') return value;
  const str = value.toString().replace(/,/g, '');
  const match = str.match(/[\d.]+/);
  if (!match) return NaN;
  const num = parseFloat(match[0]);
  if (str.includes('ton')) return num * 1000;
  if (str.includes('meter')) return num * 100;
  return num;
}

function isMissing(value) {
  return value === null || value === undefined || value === '' || value === '-';
}

function displayValue(value) {
  if (isMissing(value)) return '-';
  return value;
}
