// 全局变量存储图表实例和数据
let priceChart = null;
let priceData = [];

// 当文档加载完成时初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化UI元素引用
  const modeBtns = document.querySelectorAll('.mode-switch button');
  const fuelBtns = document.querySelectorAll('.fuel-btn');
  const fromDate = document.getElementById('from-date');
  const toDate = document.getElementById('to-date');
  const toLabel = document.getElementById('to-label');
  const dateError = document.getElementById('date-error');
  
  // 初始化日期选择器（添加2022-01到2024-12的月份选项）
  const months = [];
  for (let y = 2022; y <= 2024; y++) {
    for (let m = 1; m <= 12; m++) {
      const val = `${y}-${m.toString().padStart(2, '0')}`;
      months.push(val);
    }
  }
  
  // 清空现有选项（保留默认的空选项）
  while (fromDate.options.length > 1) {
    fromDate.remove(1);
  }
  while (toDate.options.length > 1) {
    toDate.remove(1);
  }
  
  // 添加月份选项
  months.forEach(month => {
    fromDate.add(new Option(month, month));
    toDate.add(new Option(month, month));
  });
  
  // 加载价格数据
  fetch('js/fuel_price_data.json')
    .then(response => response.json())
    .then(data => {
      priceData = data;
      
      // 设置默认值
      let currentRegion = "Queensland";
      let currentFuel = "91";
      
      // 设置默认选中的燃油按钮
      document.querySelector('.fuel-btn[data-fuel="91"]').classList.add('active');
      
      // 创建初始图表
      updateChart(currentRegion, currentFuel, null, null);
      
      // 添加事件监听器
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
      
      // 日期选择监听器
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

// 更新图表函数
function updateChart(region, fuelType, fromDate, toDate) {
  // 过滤数据
  let filteredData = priceData.filter(item => item.region === region);
  
  // 如果有日期范围，进一步过滤
  if (fromDate) {
    filteredData = filteredData.filter(item => item.date >= fromDate);
  }
  if (toDate) {
    filteredData = filteredData.filter(item => item.date <= toDate);
  }
  
  // 按日期排序
  filteredData.sort((a, b) => a.date.localeCompare(b.date));
  
  // 准备图表数据
  const labels = filteredData.map(item => item.date);
  const prices = filteredData.map(item => item[fuelType]);
  
  // 获取Canvas上下文
  const ctx = document.getElementById('chart-canvas').getContext('2d');
  
  // 销毁现有图表（如果存在）
  if (priceChart) {
    priceChart.destroy();
  }
  
  // 创建新图表
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

// 根据燃油类型返回对应的颜色
function getFuelColor(fuelType, alpha = 1) {
  const colors = {
    'E10': `rgba(16, 42, 60, ${alpha})`,   // 原始按钮颜色
    '91': `rgba(74, 144, 226, ${alpha})`,
    '95': `rgba(226, 139, 69, ${alpha})`,
    '98': `rgba(208, 33, 28, ${alpha})`,
    'D': `rgba(0, 0, 0, ${alpha})`
  };
  
  return colors[fuelType] || `rgba(128, 128, 128, ${alpha})`;
}