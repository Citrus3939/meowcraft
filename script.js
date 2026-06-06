const consultationForm = document.querySelector("#consultationForm");
const toast = document.querySelector("#toast");

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;

  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 5200);
}

consultationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(consultationForm);
  const character = formData.get("character") || "your character";
  const email = formData.get("email");

  showToast(`Consultation request drafted for ${character}. In Shopify, connect this form to send details to ${email}.`);
  consultationForm.reset();
});
