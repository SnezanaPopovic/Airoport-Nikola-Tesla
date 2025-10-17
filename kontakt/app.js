document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const btnSubmit = document.getElementById("posalji");

  // Uzmi trenutni jezik
  const getCurrentLang = () => localStorage.getItem("siteLanguage") || "sr";

  // Poruke na srpskom i engleskom
  const errorMessages = {
    sr: {
      imeObavezno: "Ime je obavezno.",
      imeKratko: "Ime mora imati najmanje 2 karaktera.",
      prezimeObavezno: "Prezime je obavezno.",
      prezimeKratko: "Prezime mora imati najmanje 2 karaktera.",
      emailObavezan: "Email je obavezan.",
      emailFormat: "Unesite ispravan email format.",
      porukaObavezna: "Poruka je obavezna.",
      porukaKratka: "Poruka mora imati najmanje 10 karaktera.",
    },
    en: {
      imeObavezno: "Name is required.",
      imeKratko: "Name must have at least 2 characters.",
      prezimeObavezno: "Surname is required.",
      prezimeKratko: "Surname must have at least 2 characters.",
      emailObavezan: "Email is required.",
      emailFormat: "Enter a valid email format.",
      porukaObavezna: "Message is required.",
      porukaKratka: "Message must have at least 10 characters.",
    },
  };

  btnSubmit.addEventListener("click", function (e) {
    e.preventDefault();

    const imeInput = document.getElementById("ime");
    const prezimeInput = document.getElementById("prezime");
    const emailInput = document.getElementById("email");
    const porukaInput = document.getElementById("poruka");

    const imeError = document.getElementById("ime-error");
    const prezimeError = document.getElementById("prezime-error");
    const emailError = document.getElementById("email-error");
    const porukaError = document.getElementById("poruka-error");

    // Reset starih poruka
    imeError.textContent = "";
    prezimeError.textContent = "";
    emailError.textContent = "";
    porukaError.textContent = "";

    // Uzmi poruke za trenutni jezik
    const currentLang = getCurrentLang();
    const msg = errorMessages[currentLang];

    let hasError = false;

    //Validacija imena
    if (imeInput.value.trim() === "") {
      imeError.textContent = msg.imeObavezno;
      hasError = true;
    } else if (imeInput.value.trim().length < 2) {
      imeError.textContent = msg.imeKratko;
      hasError = true;
    }

    //Validacija prezimena
    if (prezimeInput.value.trim() === "") {
      prezimeError.textContent = msg.prezimeObavezno;
      hasError = true;
    } else if (prezimeInput.value.trim().length < 2) {
      prezimeError.textContent = msg.prezimeKratko;
      hasError = true;
    }

    //Validacija emaila
    if (emailInput.value.trim() === "") {
      emailError.textContent = msg.emailObavezan;
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
      emailError.textContent = msg.emailFormat;
      hasError = true;
    }

    //Validacija poruke
    if (porukaInput.value.trim() === "") {
      porukaError.textContent = msg.porukaObavezna;
      hasError = true;
    } else if (porukaInput.value.trim().length < 10) {
      porukaError.textContent = msg.porukaKratka;
      hasError = true;
    }

    if (!hasError) {
      const contactData = {
        ime: imeInput.value.trim(),
        prezime: prezimeInput.value.trim(),
        email: emailInput.value.trim(),
        poruka: porukaInput.value.trim(),
      };
      localStorage.setItem("contactData", JSON.stringify(contactData));
      localStorage.setItem("contactSubmitted", "true");
      window.location.href = "../potvrda/index.html";
    }
  });
});
