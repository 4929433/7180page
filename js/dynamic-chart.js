// Global variables store chart instances and data
let priceChart = null;
let priceData = [];

// Initialize when the document is loading
document.addEventListener('DOMContentLoaded', function() {
  // Initialize UI element references
  const modeBtns = document.querySelectorAll('.mode-switch button');
  const fuelBtns = document.querySelectorAll('.fuel-btn');
  const fromDate = document.getElementById('from-date');
  const toDate = document.getElementById('to-date');
  const toLabel = document.getElementById('to-label');
  const dateError = document.getElementById('date-error');
  
  // Initialize date selector
  const months = [];
  for (let y = 2022; y <= 2024; y++) {
    for (let m = 1; m <= 12; m++) {
      const val = `${y}-${m.toString().padStart(2, '0')}`;
      months.push(val);
    }
  }
  
  // Clear existing options
  while (fromDate.options.length > 1) {
    fromDate.remove(1);
  }
  while (toDate.options.length > 1) {
    toDate.remove(1);
  }
  
  // Add month option
  months.forEach(month => {
    fromDate.add(new Option(month, month));
    toDate.add(new Option(month, month));
  });
  
  // Loading price data
  fetch('js/fuel_price_data.json')
    .then(response => response.json())
    .then(data => {
      priceData = data;
      
      // Set default values
      let currentRegion = "Queensland";
      let currentFuel = "91";
      
      // Set the fuel button selected by default
      document.querySelector('.fuel-btn[data-fuel="91"]').classList.add('active');
      
      // Create an initial chart
      updateChart(currentRegion, currentFuel, null, null);
      
      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          modeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentRegion = btn.textContent;
          updateChart(currentRegion, currentFuel, fromDate.value, toDate.value);
        });
      });
      
      fuelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          fuelBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFuel = btn.dataset.fuel;
          updateChart(currentRegion, currentFuel, fromDate.value, toDate.value);
        });
      });
      
      fromDate.addEventListener('change', () => {
        updateChart(currentRegion, currentFuel, fromDate.value, toDate.value);
      });
      
      toDate.addEventListener('change', () => {
        if (fromDate.value && toDate.value && toDate.value <= fromDate.value) {
          toLabel.classList.add('invalid-label');
          dateError.textContent = 'To date must be after From date.';
        } else {
          toLabel.classList.remove('invalid-label');
          dateError.textContent = '';
          updateChart(currentRegion, currentFuel, fromDate.value, toDate.value);
        }
      });
    })
    .catch(error => {
      console.error('Error loading fuel price data:', error);
      alert('Failed to load price data. Please try again later.');
    });
});

// Update the chart function
function updateChart(region, fuelType, fromDate, toDate) {
  // Filter data
  let filteredData = priceData.filter(item => item.region === region);
  
  if (fromDate) {
    filteredData = filteredData.filter(item => item.date >= fromDate);
  }
  if (toDate) {
    filteredData = filteredData.filter(item => item.date <= toDate);
  }
  
  // Sort by date
  filteredData.sort((a, b) => a.date.localeCompare(b.date));
  
  const labels = filteredData.map(item => item.date);
  const prices = filteredData.map(item => item[fuelType]);
  
  const ctx = document.getElementById('chart-canvas').getContext('2d');
  
  if (priceChart) {
    priceChart.destroy();
  }
  
  // Create a new chart
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${fuelType} Fuel Price ($/L)`,
        data: prices,
        borderColor: getFuelColor(fuelType),
        backgroundColor: getFuelColor(fuelType, 0.2),
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${region} ${fuelType} Fuel Price History`,
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Price: $${context.raw.toFixed(3)}/L`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price ($/L)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    }
  });
}

// Return the corresponding color according to fuel type
function getFuelColor(fuelType, alpha = 1) {
  const colors = {
    'E10': `rgba(16, 42, 60, ${alpha})`,   // Original color
    '91': `rgba(74, 144, 226, ${alpha})`,
    '95': `rgba(226, 139, 69, ${alpha})`,
    '98': `rgba(208, 33, 28, ${alpha})`,
    'D': `rgba(0, 0, 0, ${alpha})`
  };
  
  return colors[fuelType] || `rgba(128, 128, 128, ${alpha})`;
}