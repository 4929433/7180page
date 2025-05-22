function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // 获取URL参数
  const stationParam = getQueryParam("id") || "0";
  console.log("🔍 Raw URL parameter:", stationParam);
  
  // 直接转换为数组索引（0-based）
  let stationIndex = parseInt(stationParam);
  if (isNaN(stationIndex)) {
    stationIndex = 0; // 默认第一个
  }
  console.log("📍 Target station index:", stationIndex);
  
  // 获取所有数据
  fetch('https://sheetdb.io/api/v1/ixwxxwtb81gts')
    .then(res => res.json())
    .then(allData => {
      console.log("📊 Total stations available:", allData.length);
      
      // 显示所有可用站点
      allData.forEach((station, index) => {
        console.log(`Station ${index}:`, station.name || "Unnamed Station");
      });
      
      // 确保索引在有效范围内
      if (stationIndex >= allData.length) {
        console.log("⚠️ Index out of range, using index 0");
        stationIndex = 0;
      }
      
      // 直接使用索引获取站点
      const targetStation = allData[stationIndex];
      console.log("✅ Selected station:", {
        index: stationIndex,
        name: targetStation.name,
        station: targetStation
      });
      
      displayStationData(targetStation);
    })
    .catch(err => {
      console.error("❌ API Error:", err);
      displayErrorMessage();
    });
  
  function displayStationData(station) {
    console.log("🏪 Displaying station data for:", station.name);
    
    // ===== 基本信息绑定 =====
    document.querySelector(".station-details h2").textContent = station.name || "Unknown Station";
  
    // 地址
    const addressP = document.querySelector(".info-item:nth-of-type(1) p");
    const addressCopy = document.querySelector(".info-item:nth-of-type(1) .copy-btn");
    const address = station.address || "Address not available";
    addressP.textContent = address;
    addressCopy.setAttribute("data-clipboard-text", address);
  
    // 开放时间
    document.querySelector(".info-item:nth-of-type(2) p").textContent = station.open_hours || "Open 24 hours";
  
    // 网站
    document.querySelector(".info-item:nth-of-type(3) p").textContent = station.website || "None";
  
    // 电话
    const phoneP = document.querySelector(".info-item:nth-of-type(4) p");
    const phoneCopy = document.querySelector(".info-item:nth-of-type(4) .copy-btn");
    const phone = station.phone_number || "None";
    phoneP.textContent = phone;
    phoneCopy.setAttribute("data-clipboard-text", phone);
  
    // ===== 评分条处理 =====
    const ratingKeys = [
      "score_environment",
      "score_service", 
      "score_fuel_quality",
      "score_facilities",
      "score_cleanliness"
    ];
  
    const ratingEls = document.querySelectorAll(".rating-item .progress");
    const ratingValues = [];
  
    ratingEls.forEach((bar, index) => {
      const val = parseFloat(station[ratingKeys[index]]);
      const score = isNaN(val) ? Math.random() * 2 + 2.5 : Math.min(5, val);
      ratingValues.push(score);
      bar.style.width = (score * 20) + "%";
    });
  
    // 计算并显示平均分
    const average = (ratingValues.reduce((sum, v) => sum + v, 0) / ratingValues.length).toFixed(1);
    document.querySelector(".overall-rating h2").textContent = average;
  
    // ===== 服务项处理 =====
    const serviceSection = document.querySelector(".service-section");
    const oldServices = serviceSection.querySelectorAll(".service-item");
    oldServices.forEach(el => el.remove());
  
    let inserted = false;
    for (let i = 1; i <= 3; i++) {
      const name = station[`service${i}_name`];
      const features = station[`service${i}_features`];
      const image = station[`service${i}_image`];
  
      if (name) {
        inserted = true;
        const serviceItem = document.createElement("div");
        serviceItem.className = "service-item";
        serviceItem.innerHTML = `
          <div class="service-info">
            <h4>${name}</h4>
            <p class="service-type">Nearby Service</p>
            <div class="service-features">
              ${features?.split(",").map(f => `<span>${f.trim()}</span>`).join("") || ""}
            </div>
          </div>
          <div class="service-image">
            <img src="${image || 'image/default-service.png'}" alt="${name}" onerror="this.src='image/default-service.png'">
          </div>
        `;
        serviceSection.appendChild(serviceItem);
      }
    }
  
    // 默认服务项
    if (!inserted) {
      const defaultServices = [
        {
          name: "McDonald's",
          type: "Fast food restaurant",
          features: ["Drive-through", "Outdoor seating", "Dine-in"],
          image: "image/McDonald's_logo.svg.png"
        },
        {
          name: "KFC", 
          type: "Fast food restaurant",
          features: ["Drive-through", "Outdoor seating", "Dine-in"],
          image: "image/KFC.png"
        },
        {
          name: "Car Wash Auto",
          type: "Car wash",
          features: ["24 hours/7 days", "Credit cards", "NFC mobile payments"],
          image: "image/carwash.JPG"
        }
      ];
  
      defaultServices.forEach(service => {
        const item = document.createElement("div");
        item.className = "service-item";
        item.innerHTML = `
          <div class="service-info">
            <h4>${service.name}</h4>
            <p class="service-type">${service.type}</p>
            <div class="service-features">
              ${service.features.map(f => `<span>${f}</span>`).join("")}
            </div>
          </div>
          <div class="service-image">
            <img src="${service.image}" alt="${service.name}" onerror="this.src='image/default-service.png'">
          </div>
        `;
        serviceSection.appendChild(item);
      });
    }
  
    // 更新页面标题
    document.title = `FuelTrack AU - ${station.name || 'Station Details'}`;
    console.log("✅ Station data displayed successfully for:", station.name);
  }
  
  function displayErrorMessage() {
    document.querySelector(".station-details h2").textContent = "Station Information Unavailable";
    document.querySelector(".info-item:nth-of-type(1) p").textContent = "Address not available";
    document.querySelector(".overall-rating h2").textContent = "N/A";
    console.log("❌ Error message displayed");
  }