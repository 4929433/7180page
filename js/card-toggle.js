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
      
      console.log(`Start navigation to: ${stationName}`);
      
      const originalText = this.textContent;
      this.textContent = 'Navigating...';
      
      setTimeout(() => {
        this.textContent = originalText;
        alert(`Navigate to ${stationName} Started`);
        
      }, 1000);
    });
  });
  
  // Fuel type selector
  const fuelType = document.getElementById('fuelType');
  if (fuelType) {
    fuelType.addEventListener('change', function() {
      console.log(`Fuel type selected: ${this.value}`);

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
        alert('Please enter a value');
        return;
      }
      
      console.log(`Start calculating, enter the value: ${inputValue}`);
      
      alert(`The calculation is completed!You can check the prices of nearby gas stations`);
    });
  }
});