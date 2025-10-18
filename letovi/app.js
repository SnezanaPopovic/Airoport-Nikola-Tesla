//Scroll to top dugme
const scrollBtn = document.createElement("button");
scrollBtn.innerHTML = "⬆";
scrollBtn.classList.add("scroll-top-btn");
document.body.appendChild(scrollBtn);

scrollBtn.style.display = "none";

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

//Form validacija (bez localStorage)
const form = document.querySelector("form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ime = document.getElementById("ime").value.trim();
    const prezime = document.getElementById("prezime").value.trim();
    const email = document.getElementById("email").value.trim();
    const poruka = document.getElementById("poruka").value.trim();

    if (!ime || !prezime || !email || !poruka) {
      alert("Molimo popunite sva polja!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Unesite validan e-mail!");
      return;
    }

    alert("Hvala, vaša poruka je uspešno poslata! ✈");
    form.reset();
  });
}

// Sortiranje i filtriranje letova
const table = document.querySelector("table");

if (table) {
  const container = document.querySelector(".container");
  const tbody = table.querySelector("tbody");
  const allRows = Array.from(tbody.querySelectorAll("tr"));

  const translations = {
    sr: {
      filterDateBtn: "Filtriraj",
      filterStatusBtn: "Filtriraj",
      sortBtn: "Sortiraj",
      resetBtn: "Resetuj",
      placeholder: "DD.MM.YYYY",
      selectPlaceholder: "Status leta",
      onTimeOption: "Na vreme",
      delayedOption: "Kasne",
      cancelledOption: "Otkazani",
      noFlightsSort: "⚠️ Nema letova",
      sortSuccess: "✅ Sortirano",
      invalidDate: "⚠️ Nevažeći format",
      noFlightsDate: "❌ Nema letova",
      noFlightsStatus: "❌ Nema letova",
      flightsShown: "Prikazano",
      flights: "let(ova)",
      allFlightsShown: "✅ Svi letovi",
      dateLabel: "Datum",
      statusLabel: "Status",
    },
    en: {
      filterDateBtn: "Filter",
      filterStatusBtn: "Filter",
      sortBtn: "Sort",
      resetBtn: "Reset",
      placeholder: "DD.MM.YYYY",
      selectPlaceholder: "Flight status",
      onTimeOption: "On time",
      delayedOption: "Delayed",
      cancelledOption: "Cancelled",
      noFlightsSort: "⚠️ No flights",
      sortSuccess: "✅ Sorted",
      invalidDate: "⚠️ Invalid format",
      noFlightsDate: "❌ No flights",
      noFlightsStatus: "❌ No flights",
      flightsShown: "Showing",
      flights: "flight(s)",
      allFlightsShown: "✅ All flights",
      dateLabel: "Date",
      statusLabel: "Status",
    },
  };

  let currentLang = "sr";

  // GLAVNI CONTAINER
  const controlsWrapper = document.createElement("div");
  controlsWrapper.className = "flights-controls-wrapper";
  controlsWrapper.style.cssText = `
    width: 100%;
    max-width: 1200px;
    margin: 15px auto 12px;
    padding: 14px 16px;
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    border: 1px solid #e8e8e8;
  `;

  // GLAVNI GRID
  const mainGrid = document.createElement("div");
  mainGrid.className = "main-grid";
  mainGrid.style.cssText = `
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: start;
  `;

  // LEVA STRANA - Filteri
  const filtersWrapper = document.createElement("div");
  filtersWrapper.className = "filters-wrapper";
  filtersWrapper.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;

  // SEKCIJA 1: Datum
  const dateSection = document.createElement("div");
  dateSection.className = "date-section";
  dateSection.style.cssText = `display: flex; flex-direction: column; gap: 6px;`;

  const dateSectionTitle = document.createElement("div");
  dateSectionTitle.textContent = translations[currentLang].dateLabel;
  dateSectionTitle.style.cssText = `
    font-size: 11px;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  `;

  const dateControls = document.createElement("div");
  dateControls.className = "date-controls";
  dateControls.style.cssText = `display: flex; gap: 8px; align-items: stretch;`;

  const dateInput = document.createElement("input");
  dateInput.type = "text";
  dateInput.placeholder = translations[currentLang].placeholder;
  dateInput.className = "date-input";
  dateInput.style.cssText = `
    flex: 1;
    max-width: 180px;
    padding: 8px 10px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    font-size: 13px;
    transition: all 0.2s ease;
    outline: none;
    background-color: #fafafa;
  `;

  dateInput.addEventListener("focus", () => {
    dateInput.style.borderColor = "#999";
    dateInput.style.backgroundColor = "#fff";
  });
  dateInput.addEventListener("blur", () => {
    dateInput.style.borderColor = "#d8d8d8";
    dateInput.style.backgroundColor = "#fafafa";
  });

  const filterDateBtn = document.createElement("button");
  filterDateBtn.textContent = translations[currentLang].filterDateBtn;
  filterDateBtn.className = "filter-date-btn";
  filterDateBtn.style.cssText = `
    padding: 8px 16px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  `;

  filterDateBtn.addEventListener("mouseenter", () => {
    filterDateBtn.style.backgroundColor = "#5a6268";
  });
  filterDateBtn.addEventListener("mouseleave", () => {
    filterDateBtn.style.backgroundColor = "#6c757d";
  });

  dateControls.appendChild(dateInput);
  dateControls.appendChild(filterDateBtn);
  dateSection.appendChild(dateSectionTitle);
  dateSection.appendChild(dateControls);

  // SEKCIJA 2: Status
  const statusSection = document.createElement("div");
  statusSection.className = "status-section";
  statusSection.style.cssText = `display: flex; flex-direction: column; gap: 6px;`;

  const statusSectionTitle = document.createElement("div");
  statusSectionTitle.textContent = translations[currentLang].statusLabel;
  statusSectionTitle.style.cssText = `
    font-size: 11px;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  `;

  const statusControls = document.createElement("div");
  statusControls.className = "status-controls";
  statusControls.style.cssText = `display: flex; gap: 8px; align-items: stretch;`;

  const statusSelect = document.createElement("select");
  statusSelect.className = "status-select";
  statusSelect.style.cssText = `
    flex: 1;
    max-width: 180px;
    padding: 8px 10px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    font-size: 13px;
    background-color: #fafafa;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236c757d' d='M5 7L1 3h8z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 32px;
  `;

  const createOption = (value, text) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
  };

  statusSelect.appendChild(
    createOption("", translations[currentLang].selectPlaceholder)
  );
  statusSelect.appendChild(
    createOption("ontime", translations[currentLang].onTimeOption)
  );
  statusSelect.appendChild(
    createOption("delayed", translations[currentLang].delayedOption)
  );
  statusSelect.appendChild(
    createOption("cancelled", translations[currentLang].cancelledOption)
  );

  const filterStatusBtn = document.createElement("button");
  filterStatusBtn.textContent = translations[currentLang].filterStatusBtn;
  filterStatusBtn.className = "filter-status-btn";
  filterStatusBtn.style.cssText = `
    padding: 8px 16px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  `;

  statusControls.appendChild(statusSelect);
  statusControls.appendChild(filterStatusBtn);
  statusSection.appendChild(statusSectionTitle);
  statusSection.appendChild(statusControls);
  filtersWrapper.appendChild(dateSection);
  filtersWrapper.appendChild(statusSection);

  const actionSection = document.createElement("div");
  actionSection.className = "action-section";
  actionSection.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 18px;
  `;

  const sortBtn = document.createElement("button");
  sortBtn.textContent = translations[currentLang].sortBtn;
  sortBtn.className = "sort-btn";
  sortBtn.style.cssText = `
    padding: 8px 18px;
    background-color: #495057;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 110px;
  `;

  const resetBtn = document.createElement("button");
  resetBtn.textContent = translations[currentLang].resetBtn;
  resetBtn.className = "reset-btn";
  resetBtn.style.cssText = `
    padding: 8px 18px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    width: 110px;
  `;

  actionSection.appendChild(sortBtn);
  actionSection.appendChild(resetBtn);
  mainGrid.appendChild(filtersWrapper);
  mainGrid.appendChild(actionSection);
  controlsWrapper.appendChild(mainGrid);

  const messageDiv = document.createElement("div");
  messageDiv.className = "flights-message";
  messageDiv.style.cssText = `
    text-align: center;
    margin: 8px auto;
    font-size: 12px;
    font-weight: 500;
    min-height: 20px;
    padding: 6px;
    border-radius: 4px;
    transition: all 0.3s ease;
    max-width: 1200px;
  `;

  const tablePlaceholder = document.createElement("div");
  tablePlaceholder.style.cssText = `min-height: 400px; display: none;`;

  if (container) {
    container.insertBefore(controlsWrapper, table);
    container.insertBefore(messageDiv, table);
    container.insertBefore(tablePlaceholder, table);
  }

  let sortAscending = true;

  // RESPONSIVE STILOVI
  const applyResponsiveStyles = () => {
    const width = window.innerWidth;

    if (width <= 480) {
      controlsWrapper.style.padding = "8px 10px";
      controlsWrapper.style.margin = "8px auto 6px";

      mainGrid.style.gridTemplateColumns = "1fr";
      mainGrid.style.gap = "8px";

      filtersWrapper.style.gap = "6px";
      dateSection.style.gap = "4px";
      statusSection.style.gap = "4px";

      dateSectionTitle.style.fontSize = "9px";
      statusSectionTitle.style.fontSize = "9px";

      dateControls.style.gap = "5px";
      dateControls.style.flexWrap = "wrap";
      statusControls.style.gap = "5px";
      statusControls.style.flexWrap = "wrap";

      actionSection.style.flexDirection = "row";
      actionSection.style.gap = "5px";
      actionSection.style.paddingTop = "0";
      actionSection.style.justifyContent = "center";

      dateInput.style.fontSize = "11px";
      dateInput.style.padding = "5px 8px";
      dateInput.style.width = "100%";

      statusSelect.style.fontSize = "11px";
      statusSelect.style.padding = "5px 8px";
      statusSelect.style.paddingRight = "26px";
      statusSelect.style.width = "100%";
      statusSelect.style.backgroundPosition = "right 7px center";

      [filterDateBtn, filterStatusBtn].forEach((btn) => {
        btn.style.fontSize = "10px";
        btn.style.padding = "5px 10px";
        btn.style.width = "100%";
      });

      [sortBtn, resetBtn].forEach((btn) => {
        btn.style.fontSize = "10px";
        btn.style.padding = "5px 10px";
        btn.style.width = "calc(50% - 3px)";
      });

      messageDiv.style.fontSize = "10px";
      messageDiv.style.padding = "4px";
    } else if (width <= 768) {
      controlsWrapper.style.padding = "12px 14px";
      controlsWrapper.style.margin = "12px auto 10px";
      mainGrid.style.gridTemplateColumns = "1fr auto";
    } else {
      controlsWrapper.style.padding = "14px 16px";
      controlsWrapper.style.margin = "15px auto 12px";
    }
  };

  applyResponsiveStyles();
  window.addEventListener("resize", applyResponsiveStyles);

  // --- ostale funkcije (filter, sort, reset) ostaju iste kao ranije ---
  const toggleTableVisibility = (show) => {
    table.style.display = show ? "table" : "none";
    tablePlaceholder.style.display = show ? "none" : "block";
  };

  const filterByDate = () => {
    const inputDate = dateInput.value.trim();
    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    if (!inputDate || !dateRegex.test(inputDate)) {
      messageDiv.textContent = translations[currentLang].invalidDate;
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      return;
    }
    const filteredRows = allRows.filter(
      (row) => row.cells[4].textContent.trim() === inputDate
    );
    tbody.innerHTML = "";
    if (filteredRows.length === 0) {
      toggleTableVisibility(false);
      messageDiv.textContent = translations[currentLang].noFlightsDate;
      messageDiv.style.backgroundColor = "#f8d7da";
      messageDiv.style.color = "#721c24";
    } else {
      toggleTableVisibility(true);
      filteredRows.forEach((row) => tbody.appendChild(row));
      messageDiv.textContent = `${translations[currentLang].flightsShown} ${filteredRows.length} ${translations[currentLang].flights}`;
      messageDiv.style.backgroundColor = "#d4edda";
      messageDiv.style.color = "#155724";
    }
  };

  const filterByStatus = () => {
    const selectedStatus = statusSelect.value;
    if (!selectedStatus) {
      messageDiv.textContent = translations[currentLang].noFlightsStatus;
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      return;
    }
    const statusKeywords = {
      ontime: ["na vreme", "on time"],
      delayed: ["kasni", "delayed"],
      cancelled: ["otkazan", "cancelled"],
    };
    const filteredRows = allRows.filter((row) => {
      const status = row.cells[3].textContent.trim().toLowerCase();
      return statusKeywords[selectedStatus].some((k) => status.includes(k));
    });
    tbody.innerHTML = "";
    if (filteredRows.length === 0) {
      toggleTableVisibility(false);
      messageDiv.textContent = translations[currentLang].noFlightsStatus;
      messageDiv.style.backgroundColor = "#f8d7da";
      messageDiv.style.color = "#721c24";
    } else {
      toggleTableVisibility(true);
      filteredRows.forEach((row) => tbody.appendChild(row));
      messageDiv.textContent = `${translations[currentLang].flightsShown} ${filteredRows.length} ${translations[currentLang].flights}`;
      messageDiv.style.backgroundColor = "#d4edda";
      messageDiv.style.color = "#155724";
    }
  };

  const sortByTime = () => {
    const sortedRows = [...tbody.querySelectorAll("tr")].sort((a, b) => {
      const [ha, ma] = a.cells[1].textContent.split(":").map(Number);
      const [hb, mb] = b.cells[1].textContent.split(":").map(Number);
      return sortAscending
        ? ha * 60 + ma - (hb * 60 + mb)
        : hb * 60 + mb - (ha * 60 + ma);
    });
    sortAscending = !sortAscending;
    tbody.innerHTML = "";
    if (sortedRows.length === 0) {
      toggleTableVisibility(false);
      messageDiv.textContent = translations[currentLang].noFlightsSort;
      messageDiv.style.backgroundColor = "#f8d7da";
      messageDiv.style.color = "#721c24";
    } else {
      toggleTableVisibility(true);
      sortedRows.forEach((row) => tbody.appendChild(row));
      messageDiv.textContent = translations[currentLang].sortSuccess;
      messageDiv.style.backgroundColor = "#d4edda";
      messageDiv.style.color = "#155724";
    }
  };

  const resetFilters = () => {
    tbody.innerHTML = "";
    allRows.forEach((row) => tbody.appendChild(row));
    toggleTableVisibility(true);
    dateInput.value = "";
    statusSelect.value = "";
    messageDiv.textContent = translations[currentLang].allFlightsShown;
    messageDiv.style.backgroundColor = "#d1ecf1";
    messageDiv.style.color = "#0c5460";
  };

  filterDateBtn.addEventListener("click", filterByDate);
  filterStatusBtn.addEventListener("click", filterByStatus);
  sortBtn.addEventListener("click", sortByTime);
  resetBtn.addEventListener("click", resetFilters);
}
