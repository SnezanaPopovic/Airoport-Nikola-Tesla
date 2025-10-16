document.addEventListener("DOMContentLoaded", () => {
  const rezervisiBtn = document.querySelector(".button button");

  if (rezervisiBtn) {
    rezervisiBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Trenutni jezik (sr ili en)
      const currentLang = localStorage.getItem("siteLanguage") || "sr";

      // Poruke
      const messages = {
        sr: {
          fromEmpty: "Unesite polazište!",
          toEmpty: "Unesite odredište!",
          dateEmpty: "Unesite datum odlaska!",
          adultsEmpty: "Unesite broj odraslih!",
          adultsInvalid: "Unesite važeći broj odraslih!",
          childrenInvalid: "Unesite važeći broj dece!",
          success: "Podaci su sačuvani!",
        },
        en: {
          fromEmpty: "Enter departure!",
          toEmpty: "Enter destination!",
          dateEmpty: "Enter departure date!",
          adultsEmpty: "Enter number of adults!",
          adultsInvalid: "Enter a valid number of adults!",
          childrenInvalid: "Enter a valid number of children!",
          success: "Data saved successfully!",
        },
      };

      // Uzimanje vrednosti
      const from = document.getElementById("from");
      const to = document.getElementById("to");
      const departure = document.getElementById("departure");
      const adults = document.getElementById("adults");
      const children = document.getElementById("children");

      // Ukloni stare poruke
      document.querySelectorAll(".error-message").forEach((el) => el.remove());

      let isValid = true;

      // Funkcija za prikaz greške (poziciono ispod inputa)
      function prikaziGresku(input, poruka) {
        const span = document.createElement("span");
        span.classList.add("error-message");
        span.textContent = poruka;

        // Stil da ne menja layout
        span.style.position = "absolute";
        span.style.bottom = "-16px";
        span.style.left = "5px";
        span.style.color = "#ff4444";
        span.style.fontSize = "0.75rem";
        span.style.pointerEvents = "none";

        // Roditelju dodaj relativni položaj
        const parent = input.closest(".form-group");
        parent.style.position = "relative";
        parent.appendChild(span);
      }

      // ✅ Validacija
      if (from.value.trim() === "") {
        prikaziGresku(from, messages[currentLang].fromEmpty);
        isValid = false;
      }

      if (to.value.trim() === "") {
        prikaziGresku(to, messages[currentLang].toEmpty);
        isValid = false;
      }

      if (departure.value.trim() === "") {
        prikaziGresku(departure, messages[currentLang].dateEmpty);
        isValid = false;
      }

      if (adults.value.trim() === "") {
        prikaziGresku(adults, messages[currentLang].adultsEmpty);
        isValid = false;
      } else if (isNaN(adults.value.trim()) || Number(adults.value) <= 0) {
        prikaziGresku(adults, messages[currentLang].adultsInvalid);
        isValid = false;
      }

      if (children.value.trim() && isNaN(children.value.trim())) {
        prikaziGresku(children, messages[currentLang].childrenInvalid);
        isValid = false;
      }

      // ✅ Ako su svi podaci ispravni
      if (isValid) {
        const formData = {
          from: from.value.trim(),
          to: to.value.trim(),
          departure: departure.value.trim(),
          adults: adults.value.trim(),
          children: children.value.trim(),
        };

        localStorage.setItem("rezervacija", JSON.stringify(formData));

        alert(messages[currentLang].success);

        // Resetuj formu
        from.value = "";
        to.value = "";
        departure.value = "";
        adults.value = "";
        children.value = "";
      }
    });
  }
});
