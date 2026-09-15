document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const status = document.getElementById("form-status");

  const BASE_FEE = 1200;

  const sessionInputs = form.querySelectorAll('input[name="session"]');
  const addonInputs = form.querySelectorAll('input[name="addons"]');

  const summarySession = document.getElementById("summary-session");
  const summaryCourseFee = document.getElementById("summary-course-fee");
  const summaryAddons = document.getElementById("summary-addons");
  const summaryTotal = document.getElementById("summary-total");

  function formatCurrency(amount) {
    return "K" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ---------------------------------------------------------
     Single JS interaction: the registration summary updates
     live as the student picks a lab session or optional
     materials, with no page reload and no submit required.
     --------------------------------------------------------- */
  function updateSummary() {
    const checkedSession = form.querySelector('input[name="session"]:checked');
    if (checkedSession) {
      const label = checkedSession.closest(".session-option");
      const code = label.querySelector(".session-code").textContent;
      const time = label.querySelector(".session-time").textContent;
      summarySession.textContent = `${code} — ${time}`;
    } else {
      summarySession.textContent = "Not yet selected";
    }

    let addonsTotal = 0;
    const chosenAddons = [];
    addonInputs.forEach((input) => {
      if (input.checked) {
        addonsTotal += Number(input.dataset.fee);
        chosenAddons.push(input.nextElementSibling.textContent.split("—")[0].trim());
      }
    });

    summaryAddons.textContent = chosenAddons.length ? chosenAddons.join(", ") : "None selected";
    summaryCourseFee.textContent = formatCurrency(BASE_FEE);
    summaryTotal.textContent = formatCurrency(BASE_FEE + addonsTotal);
  }

  // Disable any lab session with zero seats left, and keep it out of tab order logically via native disabled state
  sessionInputs.forEach((input) => {
    if (Number(input.dataset.seats) === 0) {
      input.disabled = true;
    }
    input.addEventListener("change", updateSummary);
  });

  addonInputs.forEach((input) => input.addEventListener("change", updateSummary));

  updateSummary();

  /* ---------------------------------------------------------
     Validation: run on submit, write a clear message under
     each invalid field, move focus to the first problem field.
     --------------------------------------------------------- */
  function setError(fieldWrapper, errorEl, message) {
    fieldWrapper.classList.add("invalid");
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }

  function clearError(fieldWrapper, errorEl) {
    fieldWrapper.classList.remove("invalid");
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }

  function validate() {
    let firstInvalid = null;
    const problems = [];

    // Full name
    const nameField = document.getElementById("full-name");
    const nameWrapper = nameField.closest(".field");
    const nameError = document.getElementById("full-name-error");
    if (!nameField.value.trim()) {
      setError(nameWrapper, nameError, "Enter your full name.");
      problems.push(nameField);
    } else {
      clearError(nameWrapper, nameError);
    }

    // Student ID
    const idField = document.getElementById("student-id");
    const idWrapper = idField.closest(".field");
    const idError = document.getElementById("student-id-error");
    if (!idField.value.trim()) {
      setError(idWrapper, idError, "Enter your student ID.");
      problems.push(idField);
    } else if (!/^[0-9]{8}$/.test(idField.value.trim())) {
      setError(idWrapper, idError, "Student ID must be exactly 8 digits, e.g. 20231045.");
      problems.push(idField);
    } else {
      clearError(idWrapper, idError);
    }

    // Email
    const emailField = document.getElementById("email");
    const emailWrapper = emailField.closest(".field");
    const emailError = document.getElementById("email-error");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim()) {
      setError(emailWrapper, emailError, "Enter your email address.");
      problems.push(emailField);
    } else if (!emailPattern.test(emailField.value.trim())) {
      setError(emailWrapper, emailError, "Enter a valid email address, e.g. name@example.edu.");
      problems.push(emailField);
    } else {
      clearError(emailWrapper, emailError);
    }

    // Programme
    const programmeField = document.getElementById("programme");
    const programmeWrapper = programmeField.closest(".field");
    const programmeError = document.getElementById("programme-error");
    if (!programmeField.value) {
      setError(programmeWrapper, programmeError, "Select your programme of study.");
      problems.push(programmeField);
    } else {
      clearError(programmeWrapper, programmeError);
    }

    // Lab session
    const sessionFieldset = document.querySelector('input[name="session"]').closest("fieldset");
    const sessionError = document.getElementById("session-error");
    const checkedSession = form.querySelector('input[name="session"]:checked');
    if (!checkedSession) {
      sessionFieldset.classList.add("invalid");
      sessionError.textContent = "Choose a lab session.";
      sessionError.classList.add("visible");
      problems.push(document.querySelector('input[name="session"]:not(:disabled)'));
    } else {
      sessionFieldset.classList.remove("invalid");
      sessionError.textContent = "";
      sessionError.classList.remove("visible");
    }

    // Prerequisite confirmation
    const prereqField = document.getElementById("prereq");
    const prereqWrapper = prereqField.closest(".field");
    const prereqError = document.getElementById("prereq-error");
    if (!prereqField.checked) {
      setError(prereqWrapper, prereqError, "You must confirm the prerequisite to register for ICT461.");
      problems.push(prereqField);
    } else {
      clearError(prereqWrapper, prereqError);
    }

    firstInvalid = problems[0] || null;
    return firstInvalid;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const firstInvalid = validate();

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = "Please fix the highlighted fields before submitting.";
      status.className = "form-status error";
      return;
    }

    status.textContent = "Registration submitted. A confirmation has been sent to your email.";
    status.className = "form-status success";
  });

  // Clear an individual field's error as soon as the student fixes it
  form.addEventListener("input", (event) => {
    const wrapper = event.target.closest(".field");
    if (wrapper && wrapper.classList.contains("invalid")) {
      validate();
    }
  });
});
