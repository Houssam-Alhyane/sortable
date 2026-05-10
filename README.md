# 🦸‍♂️ Sortable — Superhero Data Table

A fast, interactive superhero dashboard built with **pure Vanilla JavaScript** — no frameworks, no libraries.

---

## 👥 Authors

- [msarar](https://learn.zone01oujda.ma/intra/oujda/users/11395)
- [halhyane](https://learn.zone01oujda.ma/intra/oujda/users/10310)
- [otalhaou](https://learn.zone01oujda.ma/intra/oujda/users/10980)

---

## 📌 Overview

**Sortable** is a web app that loads a large superhero dataset and displays it in a dynamic, searchable, and sortable table — built entirely with HTML, CSS, and ES6 JavaScript.

---

## 🚀 Getting Started

```bash
# No installation needed — just open the file
open index.html
```

---

## ⚙️ Data Source

```js
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then(res => res.json())
  .then(heroes => console.log(heroes));
```

---

## 📊 Features

### 📋 Table Columns

| Column | Field |
|--------|-------|
| 🖼 Icon | `.images.xs` |
| 🦸 Name | `.name` |
| 🧑 Full Name | `.biography.fullName` |
| ⚡ Powerstats | `.powerstats` (all 6 fields) |
| 🧬 Race | `.appearance.race` |
| 🚻 Gender | `.appearance.gender` |
| 📏 Height | `.appearance.height` |
| ⚖️ Weight | `.appearance.weight` |
| 🌍 Place of Birth | `.biography.placeOfBirth` |
| ⚖️ Alignment | `.biography.alignment` |

---

### 📄 Pagination

- Page size selector: **10 / 20 (default) / 50 / 100 / All**
- Updates instantly — no page reload

### 🔍 Live Search

- Filters heroes by name on every keystroke
- Example: typing `man` → Superman, Batman, Iron Man…

### 🔃 Sorting

- Click any column header to sort
- **1st click** → Ascending ↑ · **2nd click** → Descending ↓
- Default sort: **Name A → Z**
- Numeric strings (`"78 kg"`) are parsed as numbers
- Missing values always go **last**

---

## 🌟 Bonus Features

| Feature | Description |
|---------|-------------|
| 🔎 Advanced Search | Filter by any field (race, powerstats, gender…) |
| 🧠 Search Operators | `include`, `exclude`, `fuzzy`, `=`, `≠`, `>`, `<` |
| 🧾 Detail View | Click a hero → full profile with large image |
| 🔗 URL State | Filters saved in URL — survives page refresh |
| 🎨 Modern UI | Responsive, clean, smooth interactions |

---

## 🚫 Rules

| ❌ Not Allowed | ✅ Required |
|----------------|------------|
| React, Vue, Svelte… | Vanilla JS (ES6+) |
| External UI libraries | Plain HTML & CSS |
| jQuery | `fetch()` for data |



---

## 🧠 Skills Covered

DOM manipulation · Event handling · Sorting algorithms · Filtering logic · Performance optimization · State management

---

<div align="center">
  Made with 💪 at <strong>Zone01 Oujda</strong>
  <br/>
  <a href="https://github.com/Houssam-Alhyane">Houssam-Alhyane</a> ·
</div>
