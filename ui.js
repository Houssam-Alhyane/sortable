/**
 * ui.js
 * =====================================
 * - render()            : orchestrates filter → sort → paginate → draw
 * - renderRows()        : builds table rows from hero data
 * - renderPagination()  : updates page info text and button states
 * - renderSortHeaders() : adds ▲ / ▼ arrow to the active column
 * - All event listeners : search, page size, prev/next, column headers
 *
 * Depends on: state (data.js), filter/sort/paginate functions (logic.js)
 */

// ── DOM References ─────────────────────────────────────────

const tbody = document.getElementById('tbody');
const searchInput = document.getElementById('search');
const pageSizeSelect = document.getElementById('page-size');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageInfo = document.getElementById('page-info');
const headers = document.querySelectorAll('th');

// ── Render ─────────────────────────────────────────────────


function render() {
  const filtered = filterHeroes(state.heroes, state.searchValue);
  const sorted = sortHeroes(filtered, state.sortColumn, state.sortDirection);
  const totalPages = getTotalPages(sorted.length, state.pageSize);

  // Clamp page to valid range
  if (state.currentPage > totalPages) state.currentPage = 1;

  const pageData = paginateHeroes(sorted, state.pageSize, state.currentPage);

  renderRows(pageData);
  renderPagination(state.currentPage, totalPages);
  renderSortHeaders();
}
// Builds one <tr> per hero and inserts them into the table body.
function renderRows(heroes) {
  tbody.innerHTML = '';
  heroes.forEach((hero) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${hero.images.xs}" alt="${hero.name}" loading="lazy"></td>
      <td>${displayValue(hero.name)}</td>
      <td>${displayValue(hero.biography.fullName)}</td>
      <td>${displayValue(hero.powerstats.intelligence)}</td>
      <td>${displayValue(hero.powerstats.strength)}</td>
      <td>${displayValue(hero.powerstats.speed)}</td>
      <td>${displayValue(hero.powerstats.durability)}</td>
      <td>${displayValue(hero.powerstats.power)}</td>
      <td>${displayValue(hero.powerstats.combat)}</td>
      <td>${displayValue(hero.appearance.race)}</td>
      <td>${displayValue(hero.appearance.gender)}</td>
      <td>${displayValue(hero.appearance.height[1])}</td>
      <td>${displayValue(hero.appearance.weight[1])}</td>
      <td>${displayValue(hero.biography.placeOfBirth)}</td>
      <td>${displayValue(hero.biography.alignment)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Updates the "Page X / Y" text and enables/disables prev & next buttons.
function renderPagination(current, total) {
  pageInfo.textContent = `Page ${current} / ${total || 1}`;
  prevBtn.disabled = current === 1;
  nextBtn.disabled = current >= total;
}

// Highlights the sorted column header and shows ▲ or ▼.
function renderSortHeaders() {
  headers.forEach((th) => {
    // Strip old arrow first
    th.textContent = th.textContent.replace(/ [▲▼]$/, '');
    th.classList.remove('sorted');

    if (th.dataset.column === state.sortColumn) {
      th.classList.add('sorted');
      th.textContent += state.sortDirection === 'asc' ? ' ▲' : ' ▼';
    }
  });
}

// ── Event Listeners ────────────────────────────────────────

// Search input — filter resets to page 1 on every keystroke
searchInput.addEventListener('input', (e) => {
  state.searchValue = e.target.value;
  state.currentPage = 1;
  render();
});

// Page size selector — reset to page 1 when changed
pageSizeSelect.addEventListener('change', (e) => {
  state.pageSize = e.target.value === 'all' ? 'all' : Number(e.target.value);
  state.currentPage = 1;
  render();
});

// Pagination buttons
prevBtn.addEventListener('click', () => {
  state.currentPage--;
  render();
});
nextBtn.addEventListener('click', () => {
  state.currentPage++;
  render();
});

// Column header clicks — toggle asc/desc or change sort column
headers.forEach((th) => {
  th.addEventListener('click', () => {
    const col = th.dataset.column;
    if (!col || col === 'image') return;

    if (state.sortColumn === col) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortColumn = col;
      state.sortDirection = 'asc';
    }
    render();
  });
});
