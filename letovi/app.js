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

//LocalStorage za formu
const form = document.querySelector("form");

if (form) {
  // Ucitavanje iz storage
  ["ime", "prezime", "email", "poruka"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && localStorage.getItem(id)) {
      el.value = localStorage.getItem(id);
    }
  });

  //Cuvanje dok kuca
  document
    .querySelectorAll("#ime, #prezime, #email, #poruka")
    .forEach((input) => {
      input.addEventListener("input", () => {
        localStorage.setItem(input.id, input.value);
      });
    });

  // Validacija + reset
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
