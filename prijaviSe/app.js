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

const loginBtn = document.getElementById("btnSubmit");

const VALID_EMAIL = "snezana@gmail.com";
const VALID_PASSWORD = "snezana12";

// Error poruke za login formu
const loginErrorMessages = {
  sr: {
    emailObavezan: "Email je obavezan.",
    emailFormat: "Unesite ispravan email format.",
    lozinkaObavezna: "Lozinka je obavezna.",
    lozinkaKratka: "Lozinka mora imati najmanje 6 karaktera.",
    neispravniPodaci: "Neispravan email ili lozinka.",
    uspeh: "Uspešno ste se prijavili!",
  },
  en: {
    emailObavezan: "Email is required.",
    emailFormat: "Enter a valid email format.",
    lozinkaObavezna: "Password is required.",
    lozinkaKratka: "Password must have at least 6 characters.",
    neispravniPodaci: "Invalid email or password.",
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
      const enteredEmail = emailInput.value.trim();
      const enteredPassword = passwordInput.value.trim();

      // Provera da li se podaci poklapaju
      if (enteredEmail === VALID_EMAIL && enteredPassword === VALID_PASSWORD) {
        localStorage.setItem("userEmail", enteredEmail);
        localStorage.setItem("isLoggedIn", "true");

        loginForm.reset();

        emailError.textContent = "";
        passwordError.textContent = "";

        passwordInput.setAttribute("type", "password");
        if (togglePassword) {
          togglePassword.classList.remove("fa-eye");
          togglePassword.classList.add("fa-eye-slash");
        }

        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectPath;
        } else {
          alert(errors.uspeh);
          window.location.href = "../pocetna/index.html";
        }
      } else {
        emailError.textContent = errors.neispravniPodaci;
      }
    }
  });
}
