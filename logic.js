
/*  * logic.js 
 * =====================================
 * - filterHeroes : search by name
 * - sortHeroes   : sort by any column, asc or desc, missing values last
 * - paginateHeroes : slice one page from the array
 * - getTotalPages  : calculate total page count
 * Depends on: getValue, extractNumber, isMissing (data.js)
 */
// ── Filter ─────────────────────────────────────────────────


function filterHeroes(heroes, searchValue) {
  const query = searchValue.toLowerCase();
  return heroes.filter((hero) => hero.name.toLowerCase().includes(query));
}

// ── Sort ───────────────────────────────────────────────────


function sortHeroes(heroes, column, direction) {
  return [...heroes].sort((a, b) => {
    const first = getValue(a, column);
    const second = getValue(b, column);

    // Rule 1 — missing always last
    const missingA = isMissing(first);
    const missingB = isMissing(second);
    if (missingA && missingB) return 0;
    if (missingA) return 1;
    if (missingB) return -1;

    // Rule 2 — numeric comparison
    const numA = extractNumber(first);
    const numB = extractNumber(second);
    if (!isNaN(numA) && !isNaN(numB)) {
      return direction === 'asc' ? numA - numB : numB - numA;
    }

    // Rule 3 — alphabetic comparison
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
