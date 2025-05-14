const modeBtns = document.querySelectorAll('.mode-switch button');
const fuelBtns = document.querySelectorAll('.fuel-btn');
const chartImg = document.getElementById('chart-img');
const chartTitle = document.getElementById('chart-title');
const fromDate = document.getElementById('from-date');
const toDate = document.getElementById('to-date');
const toLabel = document.getElementById('to-label');
const dateError = document.getElementById('date-error');

// 构建月份选项（2022-01 到 2024-12）
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

// 初始状态
let currentRegion = "Queensland";
let currentFuel = "91"; // 虽未决定图，但用于刷新逻辑

// 区域按钮切换
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRegion = btn.textContent;
    updateChart(); // 切换图
  });
});

// 油品按钮点击后刷新（但不切换图）
fuelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    fuelBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFuel = btn.dataset.fuel;
    updateChart(); // 触发刷新，不换图
  });
});

// 日期验证
toDate.addEventListener('change', () => {
  if (fromDate.value && toDate.value <= fromDate.value) {
    toLabel.classList.add('invalid-label');
    dateError.textContent = 'To date must be after From date.';
  } else {
    toLabel.classList.remove('invalid-label');
    dateError.textContent = '';
  }
});

// 根据 currentRegion 切换图（只换地区）
function updateChart() {
  chartTitle.textContent = `${currentRegion}`;
  chartImg.src = `image/${currentRegion}_All.svg?t=${Date.now()}`; // 加时间戳强制刷新
}