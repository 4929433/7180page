/**
 * Card switching function - FuelTrack AU
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get the toggle button and card list
  const toggleButton = document.getElementById('otherOptionsToggle');
  const cardList = document.getElementById('stationCardList');
  
  if (!toggleButton || !cardList) {
    console.error('Toggle button or card list not found');
    return;
  }
  
  // Add click event processing
  toggleButton.addEventListener('click', function() {
    cardList.classList.toggle('expanded');
    
    this.classList.toggle('active');
    
    if (cardList.classList.contains('expanded')) {
      this.textContent = 'Hide Options';
      
      this.setAttribute('data-expanded', 'true');
    } else {
      this.textContent = 'Other Options';
      this.setAttribute('data-expanded', 'false');
    }
  });
  
  // Navigation Buttons
  const navButtons = document.querySelectorAll('.station-nav');
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the corresponding gas station name
      const stationCard = this.closest('.station-card');
      const stationName = stationCard.querySelector('.station-name').textContent;
      
      console.log(`开始导航至: ${stationName}`);
      
      const originalText = this.textContent;
      this.textContent = 'Navigating...';
      
      setTimeout(() => {
        this.textContent = originalText;
        alert(`导航到 ${stationName} 已启动`);
        
      }, 1000);
    });
  });
  
  // Fuel type selector
  const fuelType = document.getElementById('fuelType');
  if (fuelType) {
    fuelType.addEventListener('change', function() {
      console.log(`已选择燃油类型: ${this.value}`);

    });
  }
  
  // Calculate type button function
  const calcButtons = document.querySelectorAll('.calc-type button');
  calcButtons.forEach(button => {
    button.addEventListener('click', function() {
      calcButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Update the prompt text of the input box
      const inputLabel = document.querySelector('label[for="inputValue"]');
      if (inputLabel) {
        if (this.textContent.includes('Price')) {
          inputLabel.textContent = 'Enter Price ($)';
        } else {
          inputLabel.textContent = 'Enter Liters (L)';
        }
      }
    });
  });
  

  const calculateBtn = document.querySelector('.calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      const inputValue = document.getElementById('inputValue').value;
      if (!inputValue) {
        alert('请输入数值');
        return;
      }
      
      console.log(`开始计算，输入值: ${inputValue}`);
      
      alert(`计算完成！您可以查看附近的加油站价格。`);
    });
  }
});