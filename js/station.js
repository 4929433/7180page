function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  const stationId = getQueryParam("id") || "101";
  
  fetch(`https://sheetdb.io/api/v1/ixwxxwtb81gts/search?id=${stationId}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        alert("No station data found.");
        return;
      }
  
      const station = data[0];
  
      // ===== 基本信息绑定 =====
      document.querySelector(".station-details h2").textContent = station.name;
  
      // 地址
      const addressP = document.querySelector(".info-item:nth-of-type(1) p");
      const addressCopy = document.querySelector(".info-item:nth-of-type(1) .copy-btn");
      addressP.textContent = station.address;
      addressCopy.setAttribute("data-clipboard-text", station.address);
  
      // 开放时间（open_hours）
      document.querySelector(".info-item:nth-of-type(2) p").textContent = station.open_hours || "Open 24 hours";
  
      // 网站
      document.querySelector(".info-item:nth-of-type(3) p").textContent = station.website || "None";
  
      // 电话
      const phoneP = document.querySelector(".info-item:nth-of-type(4) p");
      const phoneCopy = document.querySelector(".info-item:nth-of-type(4) .copy-btn");
      phoneP.textContent = station.phone_number || "None";
      phoneCopy.setAttribute("data-clipboard-text", station.phone_number || "");
  
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
        const score = isNaN(val) ? 0 : Math.min(5, val);
        ratingValues.push(score);
        bar.style.width = (score * 20) + "%";
      });
  
      // 计算并显示平均分
      const average =
        ratingValues.length > 0
          ? (ratingValues.reduce((sum, v) => sum + v, 0) / ratingValues.length).toFixed(1)
          : "0.0";
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
                ${features?.split(",").map(f => `<span>${f.trim()}</span>`).join("")}
              </div>
            </div>
            <div class="service-image">
              <img src="${image}" alt="${name}">
            </div>
          `;
          serviceSection.appendChild(serviceItem);
        }
      }
  
      // 没有数据则 fallback 三个默认服务项
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
              <img src="${service.image}" alt="${service.name}">
            </div>
          `;
          serviceSection.appendChild(item);
        });
      }
    })
    .catch(err => {
      console.error("SheetDB fetch error:", err);
      alert("Failed to load fuel station data.");
    });
  