// Scroll to top dugme
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

// Form validacija
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

  // GLAVNI GRID - 2 kolone, responsive
  const mainGrid = document.createElement("div");
  mainGrid.className = "main-grid";
  mainGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    align-items: start;
  `;

  // FILTERI WRAPPER
  const filtersWrapper = document.createElement("div");
  filtersWrapper.className = "filters-wrapper";
  filtersWrapper.style.cssText = `display: flex; flex-direction: column; gap: 12px;`;

  // DATE SECTION
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
  dateControls.style.cssText = `display: flex; gap: 8px; align-items: center; flex-wrap: wrap;`;

  const dateInput = document.createElement("input");
  dateInput.type = "text";
  dateInput.placeholder = translations[currentLang].placeholder;
  dateInput.style.cssText = `
    flex: 1 1 120px;
    max-width: 180px;
    padding: 8px 10px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    font-size: 13px;
    background-color: #fafafa;
    outline: none;
    transition: all 0.2s ease;
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
  filterDateBtn.style.cssText = `
    flex: 1 1 80px;
    max-width: 100px;
    min-width: 70px;
    padding: 6px 10px;
    font-size: 12px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: filter 0.2s;
  `;
  filterDateBtn.addEventListener(
    "mouseenter",
    () => (filterDateBtn.style.filter = "brightness(0.9)")
  );
  filterDateBtn.addEventListener(
    "mouseleave",
    () => (filterDateBtn.style.filter = "none")
  );

  dateControls.appendChild(dateInput);
  dateControls.appendChild(filterDateBtn);
  dateSection.appendChild(dateSectionTitle);
  dateSection.appendChild(dateControls);

  // STATUS SECTION
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
  statusControls.style.cssText = `display: flex; gap: 8px; align-items: center; flex-wrap: wrap;`;

  const statusSelect = document.createElement("select");
  statusSelect.className = "status-select";
  statusSelect.style.cssText = `
    flex: 1 1 120px;
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

  const filterStatusBtn = document.createElement("button");
  filterStatusBtn.textContent = translations[currentLang].filterStatusBtn;
  filterStatusBtn.style.cssText = `
    flex: 1 1 80px;
    max-width: 100px;
    min-width: 70px;
    padding: 6px 10px;
    font-size: 12px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: filter 0.2s;
  `;
  filterStatusBtn.addEventListener(
    "mouseenter",
    () => (filterStatusBtn.style.filter = "brightness(0.9)")
  );
  filterStatusBtn.addEventListener(
    "mouseleave",
    () => (filterStatusBtn.style.filter = "none")
  );

  statusControls.appendChild(statusSelect);
  statusControls.appendChild(filterStatusBtn);
  statusSection.appendChild(statusSectionTitle);
  statusSection.appendChild(statusControls);

  filtersWrapper.appendChild(dateSection);
  filtersWrapper.appendChild(statusSection);

  // SORT / RESET dugmad
  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.style.cssText = `
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 6px;
  `;

  const sortBtn = document.createElement("button");
  sortBtn.textContent = translations[currentLang].sortBtn;
  sortBtn.style.cssText = `
    flex: 1 1 100px;
    min-width: 80px;
    max-width: 120px;
    padding: 6px 10px;
    background-color: #495057;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `;
  sortBtn.addEventListener(
    "mouseenter",
    () => (sortBtn.style.filter = "brightness(0.9)")
  );
  sortBtn.addEventListener("mouseleave", () => (sortBtn.style.filter = "none"));

  const resetBtn = document.createElement("button");
  resetBtn.textContent = translations[currentLang].resetBtn;
  resetBtn.style.cssText = `
    flex: 1 1 100px;
    min-width: 80px;
    max-width: 120px;
    padding: 6px 10px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `;
  resetBtn.addEventListener(
    "mouseenter",
    () => (resetBtn.style.filter = "brightness(0.9)")
  );
  resetBtn.addEventListener(
    "mouseleave",
    () => (resetBtn.style.filter = "none")
  );

  buttonsWrapper.appendChild(sortBtn);
  buttonsWrapper.appendChild(resetBtn);
  filtersWrapper.appendChild(buttonsWrapper);

  mainGrid.appendChild(filtersWrapper);
  controlsWrapper.appendChild(mainGrid);

  // Poruka i placeholder
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

  // --- Funkcije filtriranja i sortiranja ---
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
    if (!filteredRows.length) {
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
      return statusKeywords[selectedStatus].some((keyword) =>
        status.includes(keyword)
      );
    });
    tbody.innerHTML = "";
    if (!filteredRows.length) {
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
    if (e.key === "Enter") filterByDate();
  });

  sortBtn.addEventListener("click", () => {
    const currentRows = Array.from(tbody.querySelectorAll("tr"));
    if (!currentRows.length) {
      messageDiv.textContent = translations[currentLang].noFlightsSort;
      messageDiv.style.backgroundColor = "#fff3cd";
      messageDiv.style.color = "#856404";
      return;
    }
    currentRows.sort((a, b) => {
      const parseDate = (str) => {
        const [d, m, y] = str.split(".");
        return new Date(y, m - 1, d);
      };
      const d1 = parseDate(a.cells[4].textContent.trim());
      const d2 = parseDate(b.cells[4].textContent.trim());
      return sortAscending ? d1 - d2 : d2 - d1;
    });
    tbody.innerHTML = "";
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

  resetBtn.addEventListener("click", () => {
    toggleTableVisibility(true);
    tbody.innerHTML = "";
    allRows.forEach((row) => tbody.appendChild(row));
    dateInput.value = "";
    statusSelect.value = "";
    sortAscending = true;
    messageDiv.textContent = translations[currentLang].allFlightsShown;
    messageDiv.style.backgroundColor = "#d1ecf1";
    messageDiv.style.color = "#0c5460";
    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.style.backgroundColor = "transparent";
    }, 2500);
  });

  // Jezik
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
  if (flagSr) flagSr.addEventListener("click", () => updateLanguage("sr"));
  if (flagEn) flagEn.addEventListener("click", () => updateLanguage("en"));
}
