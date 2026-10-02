// BCRTI enrolment and payment configuration
// Change ONLY enrolmentStatus to switch the public enrolment state.
// Allowed values: "coming-soon", "interest", "open", "closed"
window.BCRTI_ENROLMENT = {
  enrolmentStatus: "interest",
  interestEmail: "prodhan82@gmail.com"
};

window.BCRTI_PAYMENT = {
  stripePaymentLink: "https://buy.stripe.com/6oUaEW6gT2dc7hl6PJcjS00",
  invoiceEmail: "UPDATE_BCRTI_EMAIL"
};

document.addEventListener("DOMContentLoaded", () => {
  const enrolment = window.BCRTI_ENROLMENT || {};
  const allowedStates = new Set(["coming-soon", "interest", "open", "closed"]);
  const requestedState = (enrolment.enrolmentStatus || "closed").trim();
  const activeState = allowedStates.has(requestedState) ? requestedState : "closed";

  document.querySelectorAll("[data-enrolment-state]").forEach(section => {
    section.hidden = section.dataset.enrolmentState !== activeState;
  });

  // Register-interest action. Keeps interest separate from BILS enrolment.
  document.querySelectorAll("[data-interest-register]").forEach(a => {
    const email = (enrolment.interestEmail || "").trim();
    if (email) {
      const subject = "Foundations of Bioinformatics — registration of interest";
      const body = "Hello BCRTI,\n\nI would like to register my interest in the self-paced Foundations of Bioinformatics micro-credential.\n\nName:\nInstitution/organisation (optional):\nCareer/research stage (optional):\n\nPlease notify me when online enrolment opens.\n";
      a.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      a.href = "contact.html";
    }
  });

  const cfg = window.BCRTI_PAYMENT || {};

  // Stripe payment
  document.querySelectorAll("[data-stripe-pay]").forEach(a => {
    const link = (cfg.stripePaymentLink || "").trim();

    if (link && !link.startsWith("UPDATE_")) {
      a.href = link;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = "#payment-not-configured";
      a.addEventListener("click", e => {
        e.preventDefault();
        alert("Online payment is being configured. Please request an invoice or contact BCRTI.");
      });
    }
  });

  // Invoice requests
  document.querySelectorAll("[data-invoice-request]").forEach(a => {
    const email = (cfg.invoiceEmail || "").trim();
    const type = a.dataset.invoiceRequest || "purchase";

    if (email && !email.startsWith("UPDATE_")) {
      a.href = `mailto:${email}?subject=${encodeURIComponent(
        "BCRTI invoice request — " + type
      )}`;
    } else {
      a.href = "contact.html";
    }
  });
});
