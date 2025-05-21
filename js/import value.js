// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 检查当前页面类型，确定需要执行哪些功能
  const isHomePage = window.location.pathname.includes('homepage.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname === '';
  const isCalculatorPage = window.location.pathname.includes('calculator.html');
  
  // 如果是主页，执行表单功能
  if (isHomePage) {
    initMainPageFunctions();
  }
  
  // 如果是计算器页面，执行计算器相关功能
  if (isCalculatorPage) {
    initCalculatorFunctions();
  }
});

// 主页表单功能
function initMainPageFunctions() {
  // 安全地获取表单元素
  const amountTypeSelect = document.getElementById("amount-type");
  const unitIcon = document.getElementById("unit-icon");
  const fuelTypeSelect = document.getElementById("fuel-type");
  const valueInput = document.getElementById("value-input");
  const startBtn = document.getElementById("start-btn");
  
  // 检查必要元素是否存在
  if (!amountTypeSelect || !unitIcon || !fuelTypeSelect || !valueInput || !startBtn) {
    console.log("主页表单元素未找到，跳过初始化");
    return;
  }
  
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
    
    // 如果验证通过，提交表单数据
    if (isValid) {
      submitFormData(fuelTypeSelect.value, amountTypeSelect.value, parseFloat(valueInput.value));
    }
  });
}

// 显示错误信息
function showError(inputElement, message) {
  if (!inputElement) return;
  
  inputElement.classList.add("error");
  const formGroup = inputElement.closest(".form-group");
  if (formGroup) {
    const errorMsg = formGroup.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }
}

// 提交表单数据并处理API请求
function submitFormData(fuelType, amountType, inputValue) {
  const SHEETDB_API = 'https://sheetdb.io/api/v1/ixwxxwtb81gts';
  
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
}

// 计算器页面功能
function initCalculatorFunctions() {
  const calculateBtn = document.querySelector('.calculate-btn');
  const fuelTypeEl = document.getElementById('fuelType');
  const inputEl = document.getElementById('inputValue');
  const calcTypeButtons = document.querySelectorAll('.calc-type button');
  
  // 检查必要元素是否存在
  if (!calculateBtn || !fuelTypeEl || !inputEl) {
    console.log("计算器页面元素未找到，跳过初始化");
    return;
  }
  
  // 为计算按钮添加事件监听器
  calculateBtn.addEventListener('click', function() {
    const fuelType = fuelTypeEl.value;
    const inputValue = parseFloat(inputEl.value);
    
    // 检查输入值是否有效
    if (!fuelType || isNaN(inputValue)) {
      alert('Please select fuel type and enter a valid number.');
      return;
    }
    
    // 确定当前选择的计算类型
    let amountType = 'money'; // 默认值
    calcTypeButtons.forEach(btn => {
      if (btn.classList.contains('active')) {
        amountType = btn.textContent.includes('Price') ? 'money' : 'volume';
      }
    });
    
    // 使用API获取数据
    const SHEETDB_API = 'https://sheetdb.io/api/v1/ixwxxwtb81gts';
    
    fetch(SHEETDB_API)
      .then(r => r.json())
      .then(data => {
        const stations = data.map(st => {
          const raw = parseFloat(st[`${fuelType}_price`]);
          if (!raw || isNaN(raw)) return null;
          const price = raw / 100;
          return {
            name: st.name,
            price,
            total: amountType === 'volume'
              ? price * inputValue
              : inputValue / price
          };
        }).filter(Boolean);
        
        // 存储结果
        localStorage.setItem('fuelCalcResult', JSON.stringify({
          fuelType,
          amountType,
          inputValue,
          stations
        }));
        
        // 如果renderCards函数可用，直接调用它更新UI
        if (typeof window.renderCards === 'function') {
          window.renderCards({
            fuelType,
            amountType,
            inputValue,
            stations
          });
        } else {
          console.log('renderCards函数不可用，已保存数据到localStorage');
          alert('Data updated. Please refresh to see results.');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Failed to fetch station data.');
      });
  });
}