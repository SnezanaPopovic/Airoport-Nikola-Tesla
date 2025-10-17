document.addEventListener("DOMContentLoaded", function () {
  const flagSr = document.getElementById("flag-sr");
  const flagEn = document.getElementById("flag-en");

  if (flagSr && flagEn) {
    let currentLang = localStorage.getItem("siteLanguage") || "sr";

    // Funkcija za promenu jezika
    function switchLanguage(lang) {
      currentLang = lang;
      localStorage.setItem("siteLanguage", lang);
      document.documentElement.setAttribute("lang", lang);

      // Primeni jezik na trenutnu stranicu
      applyLanguage(lang);
    }

    function applyLanguage(lang) {
      // Promeni sve elemente sa data-lang atributima
      document.querySelectorAll("[data-lang-sr]").forEach((element) => {
        if (lang === "sr") {
          element.textContent = element.getAttribute("data-lang-sr");
        } else {
          element.textContent = element.getAttribute("data-lang-en");
        }
      });

      document.querySelectorAll("[data-placeholder-sr]").forEach((element) => {
        if (lang === "sr") {
          element.placeholder = element.getAttribute("data-placeholder-sr");
        } else {
          element.placeholder = element.getAttribute("data-placeholder-en");
        }
      });

      // Promeni title stranice ako ima data-lang atribute
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

    applyLanguage(currentLang);
  }
});
