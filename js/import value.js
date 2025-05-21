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

// 表单验证
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

  // 如果验证通过
  if (isValid) {
    alert("Form submitted successfully!"); // 或处理提交
  }
});

// 显示错误信息
function showError(inputElement, message) {
  inputElement.classList.add("error");
  const formGroup = inputElement.closest(".form-group");
  const errorMsg = formGroup.querySelector(".error-message");
  errorMsg.textContent = message;
}







const SHEETDB_API = 'https://sheetdb.io/api/v1/ixwxxwtb81gts';

document.getElementById('start-btn').addEventListener('click', () => {
  const fuelType = document.getElementById('fuel-type').value;
  const amountType = document.getElementById('amount-type').value;
  const inputValue = parseFloat(document.getElementById('value-input').value);

  if (!fuelType || !amountType || isNaN(inputValue)) {
    alert('Please fill in all fields correctly.');
    return;
  }

  // 拉取最新数据，并同时计算 total
  fetch(SHEETDB_API)
    .then(res => res.json())
    .then(data => {
      const stations = data.map(station => {
        const raw = parseFloat(station[`${fuelType}_price`]);
        if (!raw || isNaN(raw)) return null;
        const price = raw / 100; // 分→元
        return {
          name: station.name,
          price,
          total: amountType === 'volume'
            ? price * inputValue    // 升数模式：升×价＝总价
            : inputValue / price    // 金额模式：钱 ÷ 单价＝升数
        };
      }).filter(Boolean);

      // 存储并跳转
      localStorage.setItem('fuelCalcResult', JSON.stringify({
        fuelType,
        amountType,
        inputValue,
        stations
      }));
      window.location.href = 'calculator.html';
    })
    .catch(err => {
      console.error(err);
      alert('Failed to fetch station data.');
    });
});
