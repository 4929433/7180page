const amountTypeSelect = document.getElementById("amount-type");
const unitLabel = document.getElementById("unit-label");
const unitIcon = document.getElementById("unit-icon");
const fuelTypeSelect = document.getElementById("fuel-type");
const valueInput = document.getElementById("value-input");
const startBtn = document.getElementById("start-btn");

amountTypeSelect.addEventListener("change", function () {
  const selected = this.value;
  if (selected === "volume") {
 
    unitIcon.textContent = "🛢️";
  } else if (selected === "money") {

    unitIcon.textContent = "💰";
  } else {
    unitLabel.textContent = "";
    unitIcon.textContent = "";
  }
});

// Validation on START
startBtn.addEventListener("click", function () {
  let isValid = true;

  // Reset previous errors
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  [fuelTypeSelect, amountTypeSelect, valueInput].forEach(input => input.classList.remove("error"));

  if (fuelTypeSelect.value === "") {
    showError(fuelTypeSelect, "Please select a fuel type.");
    isValid = false;
  }

  if (amountTypeSelect.value === "") {
    showError(amountTypeSelect, "Please choose volume or amount.");
    isValid = false;
  }

  if (valueInput.value.trim() === "" || Number(valueInput.value) <= 0) {
    showError(valueInput, "Please enter a valid number.");
    isValid = false;
  }

  if (isValid) {
    alert("Form submitted successfully!"); // Or handle submission
  }
});

function showError(inputElement, message) {
  inputElement.classList.add("error");
  const formGroup = inputElement.closest(".form-group");
  const errorMsg = formGroup.querySelector(".error-message");
  errorMsg.textContent = message;
}
// 输入错误或未选择标红