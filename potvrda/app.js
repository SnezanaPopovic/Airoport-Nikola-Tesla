document.addEventListener("DOMContentLoaded", () => {
  const confirmationContainer = document.getElementById("confirmation");
  const contactSubmitted = localStorage.getItem("contactSubmitted");

  if (confirmationContainer && contactSubmitted === "true") {
    const data = JSON.parse(localStorage.getItem("contactData"));

    confirmationContainer.innerHTML = `
      <h2>Potvrda</h2>
      <p><strong>Ime:</strong> ${data.ime}</p>
      <p><strong>Prezime:</strong> ${data.prezime}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Poruka:</strong> ${data.poruka}</p>
      <p>Hvala što ste nas kontaktirali!</p>
    `;
  }
});
