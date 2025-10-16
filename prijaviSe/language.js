// language.js - Zajednički kod za sve stranice

document.addEventListener("DOMContentLoaded", function () {
  const flagSr = document.getElementById("flag-sr");
  const flagEn = document.getElementById("flag-en");

  if (flagSr && flagEn) {
    // Učitaj sačuvan jezik ili postavi srpski kao default
    let currentLang = localStorage.getItem("siteLanguage") || "sr";

    // Funkcija za promenu jezika
    function switchLanguage(lang) {
      currentLang = lang;
      // Čuvaj jezik u localStorage
      localStorage.setItem("siteLanguage", lang);
      document.documentElement.setAttribute("lang", lang);

      // Primeni jezik na trenutnu stranicu
      applyLanguage(lang);
    }

    // Funkcija koja primenjuje jezik na elemente
    function applyLanguage(lang) {
      // Promeni sve elemente sa data-lang atributima
      document.querySelectorAll("[data-lang-sr]").forEach((element) => {
        if (lang === "sr") {
          element.textContent = element.getAttribute("data-lang-sr");
        } else {
          element.textContent = element.getAttribute("data-lang-en");
        }
      });

      // Promeni placeholder-e za inpute (ako postoje)
      document.querySelectorAll("[data-placeholder-sr]").forEach((element) => {
        if (lang === "sr") {
          element.placeholder = element.getAttribute("data-placeholder-sr");
        } else {
          element.placeholder = element.getAttribute("data-placeholder-en");
        }
      });

      // Promeni title stranice
      const titleElement = document.querySelector("title");
      if (titleElement && titleElement.getAttribute("data-lang-sr")) {
        if (lang === "sr") {
          titleElement.textContent = titleElement.getAttribute("data-lang-sr");
        } else {
          titleElement.textContent = titleElement.getAttribute("data-lang-en");
        }
      }
    }

    // Event listeneri za zastave
    flagSr.addEventListener("click", () => {
      switchLanguage("sr");
    });

    flagEn.addEventListener("click", () => {
      switchLanguage("en");
    });

    // VAŽNO: Primeni sačuvani jezik čim se stranica učita
    applyLanguage(currentLang);
  }
});
