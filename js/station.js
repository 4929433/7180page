function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Get URL
  const stationParam = getQueryParam("id") || "0";
  console.log("🔍 Raw URL parameter:", stationParam);
  
  // Convert to array index
  let stationIndex = parseInt(stationParam);
  if (isNaN(stationIndex)) {
    stationIndex = 0; // Default
  }
  console.log("📍 Target station index:", stationIndex);
  
  // Fetch all data
  fetch('https://sheetdb.io/api/v1/ixwxxwtb81gts')
    .then(res => res.json())
    .then(allData => {
      console.log("📊 Total stations available:", allData.length);
      
      // Display all available stations
      allData.forEach((station, index) => {
        console.log(`Station ${index}:`, station.name || "Unnamed Station");
      });
      
      // Ensure index is within valid range
      if (stationIndex >= allData.length) {
        console.log("⚠️ Index out of range, using index 0");
        stationIndex = 0;
      }
      
      // Use index to get target station directly
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
    
    // ===== Bind basic info =====
    document.querySelector(".station-details h2").textContent = station.name || "Unknown Station";
  
    // Address
    const addressP = document.querySelector(".info-item:nth-of-type(1) p");
    const addressCopy = document.querySelector(".info-item:nth-of-type(1) .copy-btn");
    const address = station.address || "Address not available";
    addressP.textContent = address;
    addressCopy.setAttribute("data-clipboard-text", address);
  
    // Opening hours
    document.querySelector(".info-item:nth-of-type(2) p").textContent = station.open_hours || "Open 24 hours";
  
    // Website
    document.querySelector(".info-item:nth-of-type(3) p").textContent = station.website || "None";
  
    // Phone
    const phoneP = document.querySelector(".info-item:nth-of-type(4) p");
    const phoneCopy = document.querySelector(".info-item:nth-of-type(4) .copy-btn");
    const phone = station.phone_number || "None";
    phoneP.textContent = phone;
    phoneCopy.setAttribute("data-clipboard-text", phone);
  
    // ===== Rating bars =====
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
  
    // Calculate and display average score
    const average = (ratingValues.reduce((sum, v) => sum + v, 0) / ratingValues.length).toFixed(1);
    document.querySelector(".overall-rating h2").textContent = average;
  
    // ===== Service =====
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
  
    // Default service
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
  
    // Update page title
    document.title = `FuelTrack AU - ${station.name || 'Station Details'}`;
    console.log("✅ Station data displayed successfully for:", station.name);
  }
  
  function displayErrorMessage() {
    document.querySelector(".station-details h2").textContent = "Station Information Unavailable";
    document.querySelector(".info-item:nth-of-type(1) p").textContent = "Address not available";
    document.querySelector(".overall-rating h2").textContent = "N/A";
    console.log("❌ Error message displayed");
  }