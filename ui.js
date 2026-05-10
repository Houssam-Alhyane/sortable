/**
 * ui.js — Person 3's responsibility
 * =====================================
 * - render / renderRows / renderPagination / renderSortHeaders
 * - Modal (hero detail view)
 * - URL sync (search, field, operator, sort, page, hero)
 * - All event listeners
 */

// ── DOM Refs ───────────────────────────────────────────────
const tbody = document.getElementById('tbody');
const searchInput = document.getElementById('search');
const searchField = document.getElementById('search-field');
const searchOperator = document.getElementById('search-operator');
const pageSizeSelect = document.getElementById('page-size');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageInfo = document.getElementById('page-info');
const resultCount = document.getElementById('result-count');
const headers = document.querySelectorAll('th');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');

// ── URL Sync ───────────────────────────────────────────────

function readURL() {
  const p = new URLSearchParams(window.location.search);
  if (p.get('q')) {
    state.searchValue = p.get('q');
    searchInput.value = state.searchValue;
  }
  if (p.get('field')) {
    state.searchField = p.get('field');
    searchField.value = state.searchField;
  }
  if (p.get('op')) {
    state.searchOp = p.get('op');
    searchOperator.value = state.searchOp;
  }
  if (p.get('sort')) {
    state.sortColumn = p.get('sort');
  }
  if (p.get('dir')) {
    state.sortDirection = p.get('dir');
  }
  if (p.get('page')) {
    state.currentPage = Number(p.get('page'));
  }
  if (p.get('size')) {
    state.pageSize = p.get('size') === 'all' ? 'all' : Number(p.get('size'));
    pageSizeSelect.value = p.get('size');
  }
  if (p.get('hero')) {
    state.openHeroId = Number(p.get('hero'));
  }
}

function writeURL() {
  const p = new URLSearchParams();
  if (state.searchValue) p.set('q', state.searchValue);
  if (state.searchField !== 'name') p.set('field', state.searchField);
  if (state.searchOp !== 'include') p.set('op', state.searchOp);
  if (state.sortColumn !== 'name') p.set('sort', state.sortColumn);
  if (state.sortDirection !== 'asc') p.set('dir', state.sortDirection);
  if (state.currentPage !== 1) p.set('page', state.currentPage);
  if (state.pageSize !== 20) p.set('size', state.pageSize);
  if (state.openHeroId) p.set('hero', state.openHeroId);
  const qs = p.toString();
  history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
}

// ── Render ─────────────────────────────────────────────────

function render() {
  const filtered = filterHeroes(
    state.heroes,
    state.searchValue,
    state.searchField,
    state.searchOp
  );
  const sorted = sortHeroes(filtered, state.sortColumn, state.sortDirection);
  const totalPages = getTotalPages(sorted.length, state.pageSize);
  if (state.currentPage > totalPages) state.currentPage = 1;
  const pageData = paginateHeroes(sorted, state.pageSize, state.currentPage);

  renderRows(pageData);
  renderPagination(state.currentPage, totalPages, sorted.length);
  renderSortHeaders();
  writeURL();

  // Open hero modal if URL had hero id and heroes just loaded
  if (state.openHeroId && state.heroes.length) {
    const hero = state.heroes.find((h) => h.id === state.openHeroId);
    if (hero) openModal(hero);
    state.openHeroId = null;
  }
}

function renderRows(heroes) {
  if (!heroes.length) {
    tbody.innerHTML =
      '<tr><td colspan="15" class="loading">No heroes found</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  heroes.forEach((hero) => {
    const tr = document.createElement('tr');
    const alignment = (hero.biography.alignment || '').toLowerCase();
    const badgeClass =
      alignment === 'good'
        ? 'badge-good'
        : alignment === 'bad'
        ? 'badge-bad'
        : 'badge-neutral';

    tr.innerHTML = `
      <td><img class="hero-img" src="${hero.images.xs}" alt="${
      hero.name
    }" loading="lazy"></td>
      <td><strong>${displayValue(hero.name)}</strong></td>
      <td style="color:var(--muted)">${displayValue(
        hero.biography.fullName
      )}</td>
      <td>${statCell(hero.powerstats.intelligence)}</td>
      <td>${statCell(hero.powerstats.strength)}</td>
      <td>${statCell(hero.powerstats.speed)}</td>
      <td>${statCell(hero.powerstats.durability)}</td>
      <td>${statCell(hero.powerstats.power)}</td>
      <td>${statCell(hero.powerstats.combat)}</td>
      <td style="color:var(--muted)">${displayValue(hero.appearance.race)}</td>
      <td style="color:var(--muted)">${displayValue(
        hero.appearance.gender
      )}</td>
      <td style="color:var(--muted)">${displayValue(
        getMetric(hero.appearance.height)
      )}</td>
      <td style="color:var(--muted)">${displayValue(
        getMetric(hero.appearance.weight)
      )}</td>
      <td style="color:var(--muted);max-width:160px;overflow:hidden;text-overflow:ellipsis">${displayValue(
        hero.biography.placeOfBirth
      )}</td>
      <td><span class="badge ${badgeClass}">${displayValue(
      hero.biography.alignment
    )}</span></td>
    `;
    tr.addEventListener('click', () => openModal(hero));
    tbody.appendChild(tr);
  });
}

function statCell(val) {
  if (isMissing(val)) return '<span style="color:var(--muted)">-</span>';
  const pct = Math.min(100, Math.max(0, val));
  return `<div class="stat-cell">
    <span>${val}</span>
    <div class="stat-bar-wrap"><div class="stat-bar" style="width:${pct}%"></div></div>
  </div>`;
}

function renderPagination(current, total, count) {
  pageInfo.textContent = `Page ${current} / ${total || 1}`;
  resultCount.textContent = `${count} hero${count !== 1 ? 'es' : ''} found`;
  prevBtn.disabled = current === 1;
  nextBtn.disabled = current >= total;
}

function renderSortHeaders() {
  headers.forEach((th) => {
    th.textContent = th.textContent.replace(/ [▲▼]$/, '');
    th.classList.remove('sorted');
    if (th.dataset.column === state.sortColumn) {
      th.classList.add('sorted');
      th.textContent += state.sortDirection === 'asc' ? ' ▲' : ' ▼';
    }
  });
}

// ── Modal ──────────────────────────────────────────────────

function openModal(hero) {
  state.openHeroId = hero.id;
  writeURL();

  const stats = hero.powerstats;
  const app = hero.appearance;
  const bio = hero.biography;

  modalContent.innerHTML = `
    <div class="modal-hero">
      <img class="modal-img" src="${hero.images.md}" alt="${hero.name}">
      <div class="modal-info">
        <h2>${hero.name}</h2>
        <div class="modal-fullname">${displayValue(bio.fullName)}</div>
        <span class="badge ${
          bio.alignment === 'good'
            ? 'badge-good'
            : bio.alignment === 'bad'
            ? 'badge-bad'
            : 'badge-neutral'
        }">${displayValue(bio.alignment)}</span>
      </div>
    </div>

    <div class="modal-section">
      <h3>Power Stats</h3>
      <div class="modal-stats">
        ${['intelligence', 'strength', 'speed', 'durability', 'power', 'combat']
          .map(
            (s) => `
          <div class="modal-stat">
            <label>${s}</label>
            <div class="stat-val">${isMissing(stats[s]) ? '-' : stats[s]}</div>
            <div class="modal-stat-bar"><div class="modal-stat-bar-fill" style="width:${
              stats[s] || 0
            }%"></div></div>
          </div>`
          )
          .join('')}
      </div>
    </div>

    <div class="modal-section">
      <h3>Appearance</h3>
      <div class="modal-grid">
        ${field('Race', app.race)}
        ${field('Gender', app.gender)}
        ${field('Height', getMetric(app.height) || app.height[0])}
        ${field('Weight', getMetric(app.weight) || app.weight[0])}
        ${field('Eye Color', app.eyeColor)}
        ${field('Hair Color', app.hairColor)}
      </div>
    </div>

    <div class="modal-section">
      <h3>Biography</h3>
      <div class="modal-grid">
        ${field('Place of Birth', bio.placeOfBirth)}
        ${field('First Appearance', bio.firstAppearance)}
        ${field('Publisher', bio.publisher)}
        ${field('Alter Egos', bio.alterEgos)}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function field(label, val) {
  return `<div class="modal-field"><label>${label}</label><span>${displayValue(
    val
  )}</span></div>`;
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  state.openHeroId = null;
  writeURL();
}

// ── Events ─────────────────────────────────────────────────

searchInput.addEventListener('input', (e) => {
  state.searchValue = e.target.value;
  state.currentPage = 1;
  render();
});

searchField.addEventListener('change', (e) => {
  state.searchField = e.target.value;
  state.currentPage = 1;
  render();
});

searchOperator.addEventListener('change', (e) => {
  state.searchOp = e.target.value;
  state.currentPage = 1;
  render();
});

pageSizeSelect.addEventListener('change', (e) => {
  state.pageSize = e.target.value === 'all' ? 'all' : Number(e.target.value);
  state.currentPage = 1;
  render();
});

prevBtn.addEventListener('click', () => {
  state.currentPage--;
  render();
});
nextBtn.addEventListener('click', () => {
  state.currentPage++;
  render();
});

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

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
