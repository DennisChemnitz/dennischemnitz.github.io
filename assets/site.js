"use strict";

// Progressive enhancement: all records and links are readable without JavaScript.
const publicationList = document.querySelector("[data-publication-list]");
if (publicationList) {
  const tools = document.querySelector(".publication-tools");
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const search = document.getElementById("publication-search");
  const records = [...document.querySelectorAll(".publication[data-type]")];
  const groups = [...document.querySelectorAll(".publication-group")];
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-state");
  let selected = "all";
  tools.classList.remove("hidden-js");
  count.hidden = false;
  function update() {
    const term = search.value.normalize("NFKD").toLowerCase().trim();
    let visible = 0;
    records.forEach(record => {
      const matches = (selected === "all" || record.dataset.type === selected)
        && record.dataset.search.normalize("NFKD").toLowerCase().includes(term);
      record.hidden = !matches;
      if (matches) visible++;
    });
    groups.forEach(group => { group.hidden = ![...group.querySelectorAll(".publication")].some(record => !record.hidden); });
    count.textContent = `${visible} ${visible === 1 ? "record" : "records"}`;
    empty.hidden = visible !== 0;
  }
  buttons.forEach(button => button.addEventListener("click", () => {
    selected = button.dataset.filter;
    buttons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    update();
  }));
  search.addEventListener("input", update);
  document.getElementById("clear-search").addEventListener("click", () => {
    search.value = "";
    selected = "all";
    buttons.forEach(item => item.setAttribute("aria-pressed", String(item.dataset.filter === "all")));
    update();
    search.focus();
  });
  update();
}

if (navigator.clipboard && window.isSecureContext) {
  document.querySelectorAll("[data-copy-bib]").forEach(button => {
    button.hidden = false;
    button.addEventListener("click", async () => {
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(document.getElementById(button.dataset.copyBib).textContent);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Select and copy the citation below";
      }
      window.setTimeout(() => { button.textContent = original; }, 2200);
    });
  });
}
