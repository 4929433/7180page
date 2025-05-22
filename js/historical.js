const modeBtns = document.querySelectorAll('.mode-switch button');
const fuelBtns = document.querySelectorAll('.fuel-btn');
const chartImg = document.getElementById('chart-img');
const chartTitle = document.getElementById('chart-title');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const toLabel = document.getElementById('to-label');
const dateError = document.getElementById('date-error');

// Build month options
const months = [];
for (let y = 2022; y <= 2024; y++) {
  for (let m = 1; m <= 12; m++) {
    const val = `${y}-${m.toString().padStart(2, '0')}`;
    months.push(val);
  }
}
months.forEach(month => {
  fromDate.add(new Option(month, month));
  toDate.add(new Option(month, month));
});

// Initial status
let currentRegion = "Queensland";
let currentFuel = "91";

// Area button toggle
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRegion = btn.textContent;
    updateChart();
  });
});

// Refresh after clicking the oil button
fuelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fuelBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFuel = btn.dataset.fuel;
    updateChart(); 
  });
});

// Date verification
toDate.addEventListener('change', () => {
  if (fromDate.value && toDate.value <= fromDate.value) {
    toLabel.classList.add('invalid-label');
    dateError.textContent = 'To date must be after From date.';
  } else {
    toLabel.classList.remove('invalid-label');
    dateError.textContent = '';
  }
});

// Switch diagram according to currentRegion
function updateChart() {
  chartTitle.textContent = `${currentRegion}`;
  chartImg.src = `image/${currentRegion}_All.svg?t=${Date.now()}`; 
}