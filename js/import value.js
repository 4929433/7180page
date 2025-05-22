// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Check the current page type to determine which functions you need to perform
  const isHomePage = window.location.pathname.includes('homepage.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname === '';
  const isCalculatorPage = window.location.pathname.includes('calculator.html');
  
 
  if (isHomePage) {
    initMainPageFunctions();
  }
  

  if (isCalculatorPage) {
    initCalculatorFunctions();
  }
});

// Home page form function
function initMainPageFunctions() {
  // Get form elements
  const amountTypeSelect = document.getElementById("amount-type");
  const unitIcon = document.getElementById("unit-icon");
  const fuelTypeSelect = document.getElementById("fuel-type");
  const valueInput = document.getElementById("value-input");
  const startBtn = document.getElementById("start-btn");
  
  // Check whether the necessary elements exist
  if (!amountTypeSelect || !unitIcon || !fuelTypeSelect || !valueInput || !startBtn) {
    console.log("主页表单元素未找到，跳过初始化");
    return;
  }
  
  // Change icon according to the type you selected
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
  
  // Form Verification
  startBtn.addEventListener("click", function () {
    let isValid = true;
    
    // Reset error
    document.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    [fuelTypeSelect, amountTypeSelect, valueInput].forEach(input => input.classList.remove("error"));
    
    // Verify fuel type
    if (fuelTypeSelect.value === "") {
      showError(fuelTypeSelect, "Please select a fuel type.");
      isValid = false;
    }
    
    // Verification amount type
    if (amountTypeSelect.value === "") {
      showError(amountTypeSelect, "Please choose volume or amount.");
      isValid = false;
    }
    
    // Verify the value
    if (valueInput.value.trim() === "" || Number(valueInput.value) <= 0) {
      showError(valueInput, "Please enter a valid number.");
      isValid = false;
    }
    
    // If the verification is passed, submit the form data
    if (isValid) {
      submitFormData(fuelTypeSelect.value, amountTypeSelect.value, parseFloat(valueInput.value));
    }
  });
}

// Display error message
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

// Submit form data and process API requests
function submitFormData(fuelType, amountType, inputValue) {
  const SHEETDB_API = 'https://sheetdb.io/api/v1/ixwxxwtb81gts';
  
  if (!fuelType || !amountType || isNaN(inputValue)) {
    alert('Please fill in all fields correctly.');
    return;
  }
  
  // Pull the latest data and calculate total at the same time
  fetch(SHEETDB_API)
    .then(res => res.json())
    .then(data => {
      const stations = data.map(station => {
        const raw = parseFloat(station[`${fuelType}_price`]);
        if (!raw || isNaN(raw)) return null;
        const price = raw / 100; 
        return {
          name: station.name,
          price,
          total: amountType === 'volume'
            ? price * inputValue    
            : inputValue / price    
        };
      }).filter(Boolean);
      
      // Store and jump
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

// Calculator page function
function initCalculatorFunctions() {
  const calculateBtn = document.querySelector('.calculate-btn');
  const fuelTypeEl = document.getElementById('fuelType');
  const inputEl = document.getElementById('inputValue');
  const calcTypeButtons = document.querySelectorAll('.calc-type button');
  
  // Check whether the necessary elements exist
  if (!calculateBtn || !fuelTypeEl || !inputEl) {
    console.log("计算器页面元素未找到，跳过初始化");
    return;
  }
  
  // Add event listener to the calculation button
  calculateBtn.addEventListener('click', function() {
    const fuelType = fuelTypeEl.value;
    const inputValue = parseFloat(inputEl.value);
    
    // Check the input value
    if (!fuelType || isNaN(inputValue)) {
      alert('Please select fuel type and enter a valid number.');
      return;
    }
    
    // Determine the current calculation type
    let amountType = 'money'; // default value
    calcTypeButtons.forEach(btn => {
      if (btn.classList.contains('active')) {
        amountType = btn.textContent.includes('Price') ? 'money' : 'volume';
      }
    });
    
    // Use API to get data
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
        
        // Store results
        localStorage.setItem('fuelCalcResult', JSON.stringify({
          fuelType,
          amountType,
          inputValue,
          stations
        }));
        
        // If the renderCards function is available, call it directly to update the UI
        if (typeof window.renderCards === 'function') {
          window.renderCards({
            fuelType,
            amountType,
            inputValue,
            stations
          });
        } else {
          console.log('renderCards function is not available, save data to localStorage');
          alert('Data updated. Please refresh to see results.');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Failed to fetch station data.');
      });
  });
}