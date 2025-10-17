// TOGGLE PASSWORD VISIBILITY
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword) {
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Menja ikonu između oka i precrtanog oka
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
}

// FORGOT PASSWORD LINK
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
  forgotPassword.addEventListener("click", function (e) {
    e.preventDefault();
    const currentLang = localStorage.getItem("siteLanguage") || "sr";
    const message =
      currentLang === "sr"
        ? "Molimo kontaktirajte administratora na: popovicsnezana45@gmail.com"
        : "Please contact the administrator at: popovicsnezana45@gmail.com";
    alert(message);
  });
}

// VALIDACIJA LOGIN FORME SA PREVODIMA
const loginBtn = document.getElementById("btnSubmit");

// Error poruke za login formu
const loginErrorMessages = {
  sr: {
    emailObavezan: "Email je obavezan.",
    emailFormat: "Unesite ispravan email format.",
    lozinkaObavezna: "Lozinka je obavezna.",
    lozinkaKratka: "Lozinka mora imati najmanje 6 karaktera.",
    uspeh: "Uspešno ste se prijavili!",
  },
  en: {
    emailObavezan: "Email is required.",
    emailFormat: "Enter a valid email format.",
    lozinkaObavezna: "Password is required.",
    lozinkaKratka: "Password must have at least 6 characters.",
    uspeh: "Successfully signed in!",
  },
};

if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const currentLang = localStorage.getItem("siteLanguage") || "sr";
    const errors = loginErrorMessages[currentLang];

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    emailError.textContent = "";
    passwordError.textContent = "";

    let hasError = false;

    //VALIDACIJA EMAILA
    if (emailInput.value.trim() === "") {
      emailError.textContent = errors.emailObavezan;
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
      emailError.textContent = errors.emailFormat;
      hasError = true;
    }

    //VALIDACIJA LOZINKE
    if (passwordInput.value.trim() === "") {
      passwordError.textContent = errors.lozinkaObavezna;
      hasError = true;
    } else if (passwordInput.value.trim().length < 6) {
      passwordError.textContent = errors.lozinkaKratka;
      hasError = true;
    }

    if (!hasError) {
      alert(errors.uspeh);

      //Cuvanje podataka u localStorage
      localStorage.setItem("userEmail", emailInput.value.trim());
      localStorage.setItem("userPassword", passwordInput.value.trim());
      localStorage.setItem("isLoggedIn", "true");

      // Resetuje celu formu
      loginForm.reset();

      emailError.textContent = "";
      passwordError.textContent = "";

      passwordInput.setAttribute("type", "password");
      if (togglePassword) {
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
      }
    }
  });
}
