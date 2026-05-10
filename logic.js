/**
 * logic.js — Person 2's responsibility
 * =====================================
 * - filterHeroes : advanced search with field + operator
 * - sortHeroes   : sort by any column, asc/desc, missing last
 * - paginateHeroes / getTotalPages
 */

// ── Filter ─────────────────────────────────────────────────

function filterHeroes(heroes, searchValue, field, operator) {
  const q = searchValue.trim();
  if (!q) return heroes;

  return heroes.filter((hero) => {
    const raw = getValue(hero, field);
    const val = raw === null || raw === undefined ? '' : String(raw);
    const valLower = val.toLowerCase();
    const qLower = q.toLowerCase();

    switch (operator) {
      case 'include':
        return valLower.includes(qLower);

      case 'exclude':
        return !valLower.includes(qLower);

      case 'fuzzy':
        return fuzzyMatch(valLower, qLower);

      case 'equal':
        // numeric equal OR string equal
        if (!isNaN(extractNumber(val)) && !isNaN(Number(q))) {
          return extractNumber(val) === Number(q);
        }
        return valLower === qLower;

      case 'notEqual':
        if (!isNaN(extractNumber(val)) && !isNaN(Number(q))) {
          return extractNumber(val) !== Number(q);
        }
        return valLower !== qLower;

      case 'gt':
        return extractNumber(val) > Number(q);

      case 'lt':
        return extractNumber(val) < Number(q);

      default:
        return valLower.includes(qLower);
    }
  });
}

// Simple fuzzy: every char of query appears in order in value
function fuzzyMatch(str, query) {
  let si = 0;
  for (let qi = 0; qi < query.length; qi++) {
    si = str.indexOf(query[qi], si);
    if (si === -1) return false;
    si++;
  }
  return true;
}

// ── Sort ───────────────────────────────────────────────────

function sortHeroes(heroes, column, direction) {
  return [...heroes].sort((a, b) => {
    const first = getValue(a, column);
    const second = getValue(b, column);

    const missingA = isMissing(first);
    const missingB = isMissing(second);
    if (missingA && missingB) return 0;
    if (missingA) return 1;
    if (missingB) return -1;

    const numA = extractNumber(first);
    const numB = extractNumber(second);
    if (!isNaN(numA) && !isNaN(numB)) {
      return direction === 'asc' ? numA - numB : numB - numA;
    }

    const strA = first.toString().toLowerCase();
    const strB = second.toString().toLowerCase();
    return direction === 'asc'
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });
}

// ── Paginate ───────────────────────────────────────────────

function paginateHeroes(heroes, pageSize, currentPage) {
  if (pageSize === 'all') return heroes;
  const start = (currentPage - 1) * pageSize;
  return heroes.slice(start, start + pageSize);
}

function getTotalPages(heroCount, pageSize) {
  if (pageSize === 'all') return 1;
  return Math.ceil(heroCount / pageSize);
}
