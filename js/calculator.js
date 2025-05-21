
document.addEventListener('DOMContentLoaded', () => {
  initCollapsibleFooter();
  initCalculation();
});

function initCollapsibleFooter() {
  const footerToggle = document.getElementById('footerToggle');
  const footer = document.querySelector('.collapsible-footer');
  if (!footerToggle || !footer) return;

  footerToggle.addEventListener('click', () => {
    footer.classList.toggle('expanded');
    footerToggle.innerHTML = footer.classList.contains('expanded')
      ? 'Hide Info <i class="fas fa-chevron-up"></i>'
      : 'More Info <i class="fas fa-chevron-down"></i>';
  });

  footer.classList.remove('expanded');
  footerToggle.innerHTML = 'More Info <i class="fas fa-chevron-down"></i>';
}

function initCalculation() {
  const stored = JSON.parse(localStorage.getItem('fuelCalcResult')) || {};
  const fuelTypeEl = document.getElementById('fuelType');
  const inputEl    = document.getElementById('inputValue');
  const buttons    = document.querySelectorAll('.calc-type button');
  const btnCalc    = document.querySelector('.calculate-btn');

  // 1) 如果有 localStorage 数据，先预填并渲染
  if (stored.stations) {
    fuelTypeEl.value = stored.fuelType;
    inputEl.value    = stored.inputValue;
    buttons.forEach(btn => {
      btn.classList.toggle('active',
        stored.amountType === 'money'
          ? btn.textContent.includes('Price')
          : btn.textContent.includes('Liters')
      );
    });
    renderCards(stored);
  }

  // 2) 切换按钮样式
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 3) 点击 Calculate → 重新拉 API → 渲染
  btnCalc.addEventListener('click', () => {
    const fuelType  = fuelTypeEl.value;
    const inputVal  = parseFloat(inputEl.value);
    const amountType = document.querySelector('.calc-type button.active')
      .textContent.includes('Price') ? 'money' : 'volume';

    if (!fuelType || isNaN(inputVal)) {
      alert('Please select fuel type and enter a valid number.');
      return;
    }

    fetch('https://sheetdb.io/api/v1/ixwxxwtb81gts')
      .then(r => r.json())
      .then(data => {
        const stations = data.map(st => {
          const raw = parseFloat(st[`${fuelType}_price`]);
          if (!raw || isNaN(raw)) return null;
          const price = raw / 100;
          return {
            name:  st.name,
            price,
            total: amountType === 'volume'
              ? price * inputVal
              : inputVal / price
          };
        }).filter(Boolean);

        renderCards({ fuelType, amountType, inputValue: inputVal, stations });
      })
      .catch(err => {
        console.error(err);
        alert('Failed to fetch station data.');
      });
  });
}

function renderCards({ amountType, inputValue, stations }) {
  if (!stations.length) return;

  // 按单价升序
  stations.sort((a, b) => a.price - b.price);

  // 顶部最低价卡片
  const lowest = stations[0];
  const topCard = document.querySelector('.station-card.highlighted');
  const topDetail = amountType === 'money'
    ? `${(inputValue / lowest.price).toFixed(2)} L (for $${inputValue})`
    : `$${(lowest.price * inputValue).toFixed(2)} (for ${inputValue} L)`;

  topCard.innerHTML = `
    <div class="station-name">${lowest.name}</div>
    <div>
      <div class="station-price green">$${lowest.price.toFixed(3)}/L</div>
      <div class="station-price-detail">${topDetail}</div>
    </div>
  `;

  // 其余卡片
  const list = document.getElementById('stationCardList');
  list.innerHTML = '';
  stations.slice(1).forEach(st => {
    const detail = amountType === 'money'
      ? `${(inputValue / st.price).toFixed(2)} L (for $${inputValue})`
      : `$${(st.price * inputValue).toFixed(2)} (for ${inputValue} L)`;
    const card = document.createElement('div');
    card.className = 'station-card';
    card.innerHTML = `
      <div class="station-name">${st.name}</div>
      <div>
        <div class="station-price green">$${st.price.toFixed(3)}/L</div>
        <div class="station-price-detail">${detail}</div>
      </div>
    `;
    list.appendChild(card);
  });
}


