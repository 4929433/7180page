document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM loaded, initializing...");
  initCollapsibleFooter();
  initCalculation();
  addCardStyles();
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
  const inputEl = document.getElementById('inputValue');
  const buttons = document.querySelectorAll('.calc-type button');
  const btnCalc = document.querySelector('.calculate-btn');

  // Get all site data immediately when the page loads
  loadInitialStations();

  // Toggle button style
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Calculate Button click event
  btnCalc.addEventListener('click', () => {
    const fuelType = fuelTypeEl.value;
    const inputVal = parseFloat(inputEl.value);
    const amountType = document.querySelector('.calc-type button.active')
      .textContent.includes('Price') ? 'money' : 'volume';

    if (!fuelType || isNaN(inputVal)) {
      alert('Please select fuel type and enter a valid number.');
      return;
    }

    fetch('https://sheetdb.io/api/v1/ixwxxwtb81gts')
      .then(r => r.json())
      .then(data => {
        const stations = data.map((st, index) => {
          const raw = parseFloat(st[`${fuelType}_price`]);
          if (!raw || isNaN(raw)) return null;
          const price = raw / 100;
          return {
            name: st.name,
            price,
            arrayIndex: index,
            total: amountType === 'volume' ? price * inputVal : inputVal / price
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

function loadInitialStations() {
  console.log("📊 Loading initial stations...");
  fetch('https://sheetdb.io/api/v1/ixwxxwtb81gts')
    .then(r => r.json())
    .then(data => {
      console.log("📊 API data loaded, total stations:", data.length);
      
      if (data && data.length > 0) {
        const stations = data.slice(0, 5).map((st, index) => {
          const raw = parseFloat(st['91_price']);
          if (!raw || isNaN(raw)) return null;
          const price = raw / 100;
          
          return {
            name: st.name,
            price,
            arrayIndex: index
          };
        }).filter(Boolean);

        console.log("📊 Processed stations:", stations.map(s => ({name: s.name, index: s.arrayIndex})));
        renderInitialCards(stations);
      }
    })
    .catch(err => {
      console.error('❌ Failed to load initial stations:', err);
    });
}

function renderInitialCards(stations) {
  if (!stations.length) return;

  console.log("🎨 Rendering initial cards...");
  stations.sort((a, b) => a.price - b.price);

  // Find out the lowest price and the highest price
  const lowestPrice = stations[0].price;
  const highestPrice = stations[stations.length - 1].price;

  // Lowest price card
  const lowest = stations[0];
  const topCard = document.querySelector('.station-card.highlighted');
  
  if (topCard) {
    topCard.innerHTML = `
      <div>
        <div class="station-name">${lowest.name}</div>
        <div class="station-distance">0.2km</div>
        <div class="station-nav">Navigation</div>
      </div>
      <div>
        <div class="station-price green">$${lowest.price.toFixed(3)}/L</div>
      </div>
    `;
    topCard.setAttribute('data-index', lowest.arrayIndex);
    console.log("🏆 Top card:", lowest.name, "Index:", lowest.arrayIndex, "Price:", lowest.price.toFixed(3));
  }

  // Other cards
  const list = document.getElementById('stationCardList');
  if (list) {
    list.innerHTML = '';
    stations.slice(1).forEach((st, index) => {
      const card = document.createElement('div');
      card.className = 'station-card';
      card.setAttribute('data-index', st.arrayIndex);
      
      // Set the color category according to the price
      let priceColorClass = 'green'; // default is green
      if (st.price === highestPrice) {
        priceColorClass = 'red'; // The highest price is red
      } else if (st.price === lowestPrice) {
        priceColorClass = 'green'; // The lowest price is green
      }
      
      card.innerHTML = `
        <div>
          <div class="station-name">${st.name}</div>
          <div class="station-distance">${(0.3 + index * 0.2).toFixed(1)}km</div>
          <div class="station-nav">Navigation</div>
        </div>
        <div>
          <div class="station-price ${priceColorClass}">$${st.price.toFixed(3)}/L</div>
        </div>
      `;
      list.appendChild(card);
      console.log("🎫 Card added:", st.name, "Index:", st.arrayIndex, "Price:", st.price.toFixed(3), "Color:", priceColorClass);
    });
  }

  // Add a click event
  addCardClicks();
}

function renderCards({ amountType, inputValue, stations }) {
  if (!stations.length) return;

  console.log("🎨 Rendering calculated cards...");
  stations.sort((a, b) => a.price - b.price);

  // Find out the lowest price and the highest price
  const lowestPrice = stations[0].price;
  const highestPrice = stations[stations.length - 1].price;

  // Lowest price card
  const lowest = stations[0];
  const topCard = document.querySelector('.station-card.highlighted');
  const topDetail = amountType === 'money'
    ? `${(inputValue / lowest.price).toFixed(2)} L (for $${inputValue})`
    : `$${(lowest.price * inputValue).toFixed(2)} (for ${inputValue} L)`;

  if (topCard) {
    topCard.innerHTML = `
      <div>
        <div class="station-name">${lowest.name}</div>
        <div class="station-distance">0.2km</div>
        <div class="station-nav">Navigation</div>
      </div>
      <div>
        <div class="station-price green">$${lowest.price.toFixed(3)}/L</div>
        <div class="station-price-detail">${topDetail}</div>
      </div>
    `;
    topCard.setAttribute('data-index', lowest.arrayIndex);
  }

  // Other cards
  const list = document.getElementById('stationCardList');
  if (list) {
    list.innerHTML = '';
    stations.slice(1).forEach((st, index) => {
      const detail = amountType === 'money'
        ? `${(inputValue / st.price).toFixed(2)} L (for $${inputValue})`
        : `$${(st.price * inputValue).toFixed(2)} (for ${inputValue} L)`;
      
      // Set the color category according to the price
      let priceColorClass = 'green'; //  default is green
      if (st.price === highestPrice) {
        priceColorClass = 'red'; // The highest price is red
      } else if (st.price === lowestPrice) {
        priceColorClass = 'green'; // The lowest price is green
      }
      
      const card = document.createElement('div');
      card.className = 'station-card';
      card.setAttribute('data-index', st.arrayIndex);
      
      card.innerHTML = `
        <div>
          <div class="station-name">${st.name}</div>
          <div class="station-distance">${(0.3 + index * 0.1).toFixed(1)}km</div>
          <div class="station-nav">Navigation</div>
        </div>
        <div>
          <div class="station-price ${priceColorClass}">$${st.price.toFixed(3)}/L</div>
          <div class="station-price-detail">${detail}</div>
        </div>
      `;
      list.appendChild(card);
      console.log("🎫 Calculated card added:", st.name, "Price:", st.price.toFixed(3), "Color:", priceColorClass);
    });
  }

  // Add click event again
  addCardClicks();
}

function addCardClicks() {
  console.log("🔗 Adding click events...");
  const cards = document.querySelectorAll('.station-card');
  console.log("🔗 Found cards:", cards.length);
  
  cards.forEach((card, i) => {
    card.onclick = null;
    
    // Add a click event
    card.addEventListener('click', function(e) {
      console.log("🖱️ Card clicked:", i);
      
      // Check if the Navigation button has been clicked
      if (e.target.classList.contains('station-nav') || e.target.closest('.station-nav')) {
        console.log("🚫 Navigation button clicked");
        e.stopPropagation();
        
        const stationName = this.querySelector('.station-name').textContent;
        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(stationName + ' fuel station')}`;
        window.open(googleMapsUrl, '_blank');
        return;
      }
      
      // Get the index and jump
      const index = this.getAttribute('data-index');
      const stationName = this.querySelector('.station-name').textContent;
      
      console.log("🎯 Redirecting:", {index, stationName});
      
      if (index !== null) {
        console.log("🎯 Going to: station-detail.html?id=" + index);
        window.location.href = `station-detail.html?id=${index}`;
      } else {
        console.error("❌ No index found");
      }
    });
    
    // Add hover effect
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
    
    // Verify the index
    const index = card.getAttribute('data-index');
    console.log(`🔗 Card ${i} index:`, index);
  });
  
  console.log("✅ Click events added");
}

function addCardStyles() {
  if (document.getElementById('card-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'card-styles';
  style.textContent = `
    .station-card {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .station-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .station-nav {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .station-nav:hover {
      background-color: #007bff;
      color: white;
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
}