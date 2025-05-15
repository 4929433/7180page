// 获取表单元素
const amountTypeSelect = document.getElementById("amount-type");
const unitIcon = document.getElementById("unit-icon");
const fuelTypeSelect = document.getElementById("fuel-type");
const valueInput = document.getElementById("value-input");
const startBtn = document.getElementById("start-btn");

// 根据选择的类型更改图标
amountTypeSelect.addEventListener("change", function () {
  const selected = this.value;
  if (selected === "volume") {
    unitIcon.textContent = "🛢️";
  } else if (selected === "money") {
    unitIcon.textContent = "💰";
  } else {
    unitIcon.textContent = "";
  }
});

startBtn.addEventListener("click", function () {
  let isValid = true;

  // 重置之前的错误
  document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
  [fuelTypeSelect, amountTypeSelect, valueInput].forEach(input => input.classList.remove("error"));

  // 验证燃油类型
  if (fuelTypeSelect.value === "") {
    showError(fuelTypeSelect, "Please select a fuel type.");
    isValid = false;
  }

  // 验证金额类型
  if (amountTypeSelect.value === "") {
    showError(amountTypeSelect, "Please choose volume or amount.");
    isValid = false;
  }

  // 验证数值
  if (valueInput.value.trim() === "" || Number(valueInput.value) <= 0) {
    showError(valueInput, "Please enter a valid number.");
    isValid = false;
  }

  // ✅ 验证通过 → 跳转到 calculator.html
  if (isValid) {
    window.location.href = "calculator.html";
  }
});

// 显示错误信息
function showError(inputElement, message) {
  inputElement.classList.add("error");
  const formGroup = inputElement.closest(".form-group");
  const errorMsg = formGroup.querySelector(".error-message");
  errorMsg.textContent = message;
}
