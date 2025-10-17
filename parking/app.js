document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("parkingForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentLang = localStorage.getItem("siteLanguage") || "sr";

    //Poruke o greškama na dva jezika
    const messages = {
      sr: {
        vremeUlazaPrazno: "Unesite vreme ulaza!",
        vremeUlazaBroj: "Vreme ulaza mora biti broj!",
        vremeUlazaOpseg: "Vreme ulaza mora biti između 0 i 24!",
        vremeIzlazaPrazno: "Unesite vreme izlaza!",
        vremeIzlazaBroj: "Vreme izlaza mora biti broj!",
        vremeIzlazaOpseg: "Vreme izlaza mora biti između 0 i 24!",
        brojUlazaPrazno: "Unesite broj ulaza!",
        brojUlazaBroj: "Broj ulaza mora biti broj!",
        promoKodKratak: "Promo kod mora imati bar 3 karaktera!",
        uspeh: "Uspešno ste uneli podatke!",
      },
      en: {
        vremeUlazaPrazno: "Enter entry time!",
        vremeUlazaBroj: "Entry time must be a number!",
        vremeUlazaOpseg: "Entry time must be between 0 and 24!",
        vremeIzlazaPrazno: "Enter exit time!",
        vremeIzlazaBroj: "Exit time must be a number!",
        vremeIzlazaOpseg: "Exit time must be between 0 and 24!",
        brojUlazaPrazno: "Enter entry number!",
        brojUlazaBroj: "Entry number must be a number!",
        promoKodKratak: "Promo code must have at least 3 characters!",
        uspeh: "Data entered successfully!",
      },
    };

    // Uzimanje vrednosti iz input polja
    const vremeUlaza = document.getElementById("vreme-ulaza");
    const vremeIzlaza = document.getElementById("vreme-izlaza");
    const brojUlaza = document.getElementById("broj-ulaza");
    const promoKod = document.getElementById("promo-kod");

    // Uzimanje elemenata za poruke o greškama
    const errors = {
      vremeUlaza: document.getElementById("vreme-ulaza-error"),
      vremeIzlaza: document.getElementById("vreme-izlaza-error"),
      brojUlaza: document.getElementById("broj-ulaza-error"),
      promoKod: document.getElementById("promo-kod-error"),
    };

    //Reset poruka
    Object.values(errors).forEach((err) => (err.textContent = ""));

    let isValid = true;

    //Validacija vremena ulaza
    if (vremeUlaza.value.trim() === "") {
      errors.vremeUlaza.textContent = messages[currentLang].vremeUlazaPrazno;
      isValid = false;
    } else if (isNaN(vremeUlaza.value.trim())) {
      errors.vremeUlaza.textContent = messages[currentLang].vremeUlazaBroj;
      isValid = false;
    } else if (Number(vremeUlaza.value) < 0 || Number(vremeUlaza.value) > 24) {
      errors.vremeUlaza.textContent = messages[currentLang].vremeUlazaOpseg;
      isValid = false;
    }

    //Validacija vremena izlaza
    if (vremeIzlaza.value.trim() === "") {
      errors.vremeIzlaza.textContent = messages[currentLang].vremeIzlazaPrazno;
      isValid = false;
    } else if (isNaN(vremeIzlaza.value.trim())) {
      errors.vremeIzlaza.textContent = messages[currentLang].vremeIzlazaBroj;
      isValid = false;
    } else if (
      Number(vremeIzlaza.value) < 0 ||
      Number(vremeIzlaza.value) > 24
    ) {
      errors.vremeIzlaza.textContent = messages[currentLang].vremeIzlazaOpseg;
      isValid = false;
    }

    //Validacija broja ulaza
    if (brojUlaza.value.trim() === "") {
      errors.brojUlaza.textContent = messages[currentLang].brojUlazaPrazno;
      isValid = false;
    } else if (isNaN(brojUlaza.value.trim())) {
      errors.brojUlaza.textContent = messages[currentLang].brojUlazaBroj;
      isValid = false;
    }

    //Promo kod
    if (promoKod.value.trim() && promoKod.value.trim().length < 3) {
      errors.promoKod.textContent = messages[currentLang].promoKodKratak;
      isValid = false;
    }

    //Ako je sve ispravno
    if (isValid) {
      alert(messages[currentLang].uspeh);
      form.reset();
    }
  });

  // Dozvoljava samo brojeve za vreme i broj ulaza
  ["vreme-ulaza", "vreme-izlaza", "broj-ulaza"].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
  });
});
