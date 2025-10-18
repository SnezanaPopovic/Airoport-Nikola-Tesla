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

  // GLAVNI GRID LAYOUT
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
  dateSection.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

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
  dateControls.style.cssText = `
    display: flex;
    gap: 8px;
    align-items: stretch;
  `;

  // Input polje za datum
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

  // Dugme za filtriranje po datumu
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

  // SEKCIJA 2: Status dropdown
  const statusSection = document.createElement("div");
  statusSection.className = "status-section";
  statusSection.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;

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
  statusControls.style.cssText = `
    display: flex;
    gap: 8px;
    align-items: stretch;
  `;

  // Select dropdown za status
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

  statusSelect.addEventListener("focus", () => {
    statusSelect.style.borderColor = "#999";
    statusSelect.style.backgroundColor = "#fff";
  });

  statusSelect.addEventListener("blur", () => {
    statusSelect.style.borderColor = "#d8d8d8";
    statusSelect.style.backgroundColor = "#fafafa";
  });

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

  // Dugme za filtriranje po statusu
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

  filterStatusBtn.addEventListener("mouseenter", () => {
    filterStatusBtn.style.backgroundColor = "#5a6268";
  });

  filterStatusBtn.addEventListener("mouseleave", () => {
    filterStatusBtn.style.backgroundColor = "#6c757d";
  });

  statusControls.appendChild(statusSelect);
  statusControls.appendChild(filterStatusBtn);
  statusSection.appendChild(statusSectionTitle);
  statusSection.appendChild(statusControls);

  // Dodavanje obe sekcije u filters wrapper
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

  // Dugme za sortiranje
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
    white-space: nowrap;
    width: 110px;
  `;

  sortBtn.addEventListener("mouseenter", () => {
    sortBtn.style.backgroundColor = "#383d41";
  });

  sortBtn.addEventListener("mouseleave", () => {
    sortBtn.style.backgroundColor = "#495057";
  });

  // Reset dugme
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
    white-space: nowrap;
    width: 110px;
  `;

  resetBtn.addEventListener("mouseenter", () => {
    resetBtn.style.backgroundColor = "#5a6268";
  });

  resetBtn.addEventListener("mouseleave", () => {
    resetBtn.style.backgroundColor = "#6c757d";
  });

  actionSection.appendChild(sortBtn);
  actionSection.appendChild(resetBtn);

  // Sastavljanje glavnog grida
  mainGrid.appendChild(filtersWrapper);
  mainGrid.appendChild(actionSection);

  controlsWrapper.appendChild(mainGrid);

  // Poruka
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
  tablePlaceholder.style.cssText = `
    min-height: 400px;
    display: none;
  `;

  if (container) {
    container.insertBefore(controlsWrapper, table);
    container.insertBefore(messageDiv, table);
    container.insertBefore(tablePlaceholder, table);
  }

  let sortAscending = true;

  // Funkcija za azuriranje jezika
  const updateLanguage = (lang) => {
    currentLang = lang;
    dateSectionTitle.textContent = translations[lang].dateLabel;
    statusSectionTitle.textContent = translations[lang].statusLabel;
    sortBtn.textContent = translations[lang].sortBtn;
    resetBtn.textContent = translations[lang].resetBtn;
    filterDateBtn.textContent = translations[lang].filterDateBtn;
    filterStatusBtn.textContent = translations[lang].filterStatusBtn;
    dateInput.placeholder = translations[lang].placeholder;

    statusSelect.options[0].text = translations[lang].selectPlaceholder;
    statusSelect.options[1].text = translations[lang].onTimeOption;
    statusSelect.options[2].text = translations[lang].delayedOption;
    statusSelect.options[3].text = translations[lang].cancelledOption;
  };

  const flagSr = document.getElementById("flag-sr");
  const flagEn = document.getElementById("flag-en");

  if (flagSr) {
    flagSr.addEventListener("click", () => updateLanguage("sr"));
  }

  if (flagEn) {
    flagEn.addEventListener("click", () => updateLanguage("en"));
  }

  // RESPONSIVE STILOVI
  const applyResponsiveStyles = () => {
    const width = window.innerWidth;

    if (width <= 480) {
      controlsWrapper.style.padding = "10px 12px";
      controlsWrapper.style.margin = "10px auto 8px";

      mainGrid.style.gridTemplateColumns = "1fr";
      mainGrid.style.gap = "10px";

      filtersWrapper.style.gap = "8px";
      dateSection.style.gap = "5px";
      statusSection.style.gap = "5px";

      dateSectionTitle.style.fontSize = "10px";
      statusSectionTitle.style.fontSize = "10px";

      dateControls.style.gap = "6px";
      dateControls.style.flexWrap = "wrap";
      statusControls.style.gap = "6px";
      statusControls.style.flexWrap = "wrap";

      actionSection.style.flexDirection = "row";
      actionSection.style.gap = "6px";
      actionSection.style.paddingTop = "0";
      actionSection.style.justifyContent = "center";

      dateInput.style.fontSize = "12px";
      dateInput.style.padding = "7px 9px";
      dateInput.style.maxWidth = "100%";
      dateInput.style.width = "100%";

      statusSelect.style.fontSize = "12px";
      statusSelect.style.padding = "7px 9px";
      statusSelect.style.paddingRight = "30px";
      statusSelect.style.maxWidth = "100%";
      statusSelect.style.width = "100%";
      statusSelect.style.backgroundPosition = "right 9px center";

      [filterDateBtn, filterStatusBtn].forEach((btn) => {
        btn.style.fontSize = "11px";
        btn.style.padding = "7px 14px";
        btn.style.width = "100%";
      });

      [sortBtn, resetBtn].forEach((btn) => {
        btn.style.fontSize = "11px";
        btn.style.padding = "7px 14px";
        btn.style.width = "calc(50% - 3px)";
      });

      messageDiv.style.fontSize = "11px";
      messageDiv.style.padding = "5px";
    } else if (width <= 768) {
      controlsWrapper.style.padding = "12px 14px";
      controlsWrapper.style.margin = "12px auto 10px";

      mainGrid.style.gridTemplateColumns = "1fr auto";
      mainGrid.style.gap = "10px";

      filtersWrapper.style.gap = "9px";
      dateSection.style.gap = "5px";
      statusSection.style.gap = "5px";

      dateSectionTitle.style.fontSize = "10px";
      statusSectionTitle.style.fontSize = "10px";

      dateControls.style.gap = "7px";
      dateControls.style.flexWrap = "nowrap";
      statusControls.style.gap = "7px";
      statusControls.style.flexWrap = "nowrap";

      actionSection.style.flexDirection = "column";
      actionSection.style.gap = "7px";
      actionSection.style.paddingTop = "18px";
      actionSection.style.justifyContent = "flex-start";

      dateInput.style.fontSize = "12px";
      dateInput.style.padding = "7px 9px";
      dateInput.style.maxWidth = "160px";
      dateInput.style.width = "auto";

      statusSelect.style.fontSize = "12px";
      statusSelect.style.padding = "7px 9px";
      statusSelect.style.paddingRight = "30px";
      statusSelect.style.maxWidth = "160px";
      statusSelect.style.width = "auto";
      statusSelect.style.backgroundPosition = "right 9px center";

      [filterDateBtn, filterStatusBtn].forEach((btn) => {
        btn.style.fontSize = "12px";
        btn.style.padding = "7px 14px";
        btn.style.width = "auto";
      });

      [sortBtn, resetBtn].forEach((btn) => {
        btn.style.fontSize = "12px";
        btn.style.padding = "7px 16px";
        btn.style.width = "110px";
      });

      messageDiv.style.fontSize = "11px";
      messageDiv.style.padding = "5px";
    } else {
      controlsWrapper.style.padding = "14px 16px";
      controlsWrapper.style.margin = "15px auto 12px";

      mainGrid.style.gridTemplateColumns = "1fr auto";
      mainGrid.style.gap = "12px";

      filtersWrapper.style.gap = "10px";
      dateSection.style.gap = "6px";
      statusSection.style.gap = "6px";

      dateSectionTitle.style.fontSize = "11px";
      statusSectionTitle.style.fontSize = "11px";

      dateControls.style.gap = "8px";
      dateControls.style.flexWrap = "nowrap";
      statusControls.style.gap = "8px";
      statusControls.style.flexWrap = "nowrap";

      actionSection.style.flexDirection = "column";
      actionSection.style.gap = "8px";
      actionSection.style.paddingTop = "18px";
      actionSection.style.justifyContent = "flex-start";

      dateInput.style.fontSize = "13px";
      dateInput.style.padding = "8px 10px";
      dateInput.style.maxWidth = "180px";
      dateInput.style.width = "auto";

      statusSelect.style.fontSize = "13px";
      statusSelect.style.padding = "8px 10px";
      statusSelect.style.paddingRight = "32px";
      statusSelect.style.maxWidth = "180px";
      statusSelect.style.width = "auto";
      statusSelect.style.backgroundPosition = "right 10px center";

      [filterDateBtn, filterStatusBtn].forEach((btn) => {
        btn.style.fontSize = "12px";
        btn.style.padding = "8px 16px";
        btn.style.width = "auto";
      });

      [sortBtn, resetBtn].forEach((btn) => {
        btn.style.fontSize = "12px";
        btn.style.padding = "8px 18px";
        btn.style.width = "110px";
      });

      messageDiv.style.fontSize = "12px";
      messageDiv.style.padding = "6px";
    }
  };

  applyResponsiveStyles();
  window.addEventListener("resize", applyResponsiveStyles);

  const toggleTableVisibility = (show) => {
    if (show) {
      table.style.display = "table";
      tablePlaceholder.style.display = "none";
    } else {
      table.style.display = "none";
      tablePlaceholder.style.display = "block";
    }
  };

  // Funkcija za filtriranje po datumu
  const filterByDate = () => {
    const inputDate = dateInput.value.trim();

    if (!inputDate) {
      messageDiv.textContent = translations[currentLang].invalidDate;
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      return;
    }

    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    if (!dateRegex.test(inputDate)) {
      messageDiv.textContent = translations[currentLang].invalidDate;
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      return;
    }

    const filteredRows = allRows.filter((row) => {
      const rowDate = row.cells[4].textContent.trim();
      return rowDate === inputDate;
    });

    Array.from(tbody.querySelectorAll("tr")).forEach((row) =>
      tbody.removeChild(row)
    );

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

  // Funkcija za filtriranje po statusu
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
      return statusKeywords[selectedStatus].some((keyword) =>
        status.includes(keyword)
      );
    });

    Array.from(tbody.querySelectorAll("tr")).forEach((row) =>
      tbody.removeChild(row)
    );

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

  filterDateBtn.addEventListener("click", filterByDate);
  filterStatusBtn.addEventListener("click", filterByStatus);

  dateInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      filterByDate();
    }
  });

  // Sortiranje po datumu
  sortBtn.addEventListener("click", () => {
    const currentRows = Array.from(tbody.querySelectorAll("tr"));

    if (currentRows.length === 0) {
      messageDiv.textContent = translations[currentLang].noFlightsSort;
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      return;
    }

    currentRows.sort((a, b) => {
      const dateA = a.cells[4].textContent.trim();
      const dateB = b.cells[4].textContent.trim();

      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split(".");
        return new Date(year, month - 1, day);
      };

      const d1 = parseDate(dateA);
      const d2 = parseDate(dateB);

      return sortAscending ? d1 - d2 : d2 - d1;
    });

    currentRows.forEach((row) => tbody.removeChild(row));
    currentRows.forEach((row) => tbody.appendChild(row));

    sortAscending = !sortAscending;

    messageDiv.textContent = translations[currentLang].sortSuccess;
    messageDiv.style.backgroundColor = "#d4edda";
    messageDiv.style.color = "#155724";

    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.style.backgroundColor = "transparent";
    }, 2500);
  });

  // Reset
  resetBtn.addEventListener("click", () => {
    toggleTableVisibility(true);
    Array.from(tbody.querySelectorAll("tr")).forEach((row) =>
      tbody.removeChild(row)
    );
    allRows.forEach((row) => tbody.appendChild(row));
    dateInput.value = "";
    statusSelect.value = "";
    messageDiv.textContent = translations[currentLang].allFlightsShown;
    messageDiv.style.backgroundColor = "#d1ecf1";
    messageDiv.style.color = "#0c5460";
    sortAscending = true;

    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.style.backgroundColor = "transparent";
    }, 2500);
  });
}
