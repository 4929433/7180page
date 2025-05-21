/**
 * 卡片切换功能 - FuelTrack AU
 * 控制"Other Options"部分的展开和折叠
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取切换按钮和卡片列表
    const toggleButton = document.getElementById('otherOptionsToggle');
    const cardList = document.getElementById('stationCardList');
    
    // 确保元素存在
    if (!toggleButton || !cardList) {
      console.error('Toggle button or card list not found');
      return;
    }
    
    // 添加点击事件处理
    toggleButton.addEventListener('click', function() {
      // 切换卡片列表的显示状态
      cardList.classList.toggle('expanded');
      
      // 切换按钮活动状态样式
      this.classList.toggle('active');
      
      // 更改按钮文本（可选，取决于设计需求）
      if (cardList.classList.contains('expanded')) {
        this.textContent = 'Hide Options';
        // 保留右侧箭头
        this.setAttribute('data-expanded', 'true');
      } else {
        this.textContent = 'Other Options';
        this.setAttribute('data-expanded', 'false');
      }
    });
    
    // 导航按钮功能实现
    const navButtons = document.querySelectorAll('.station-nav');
    navButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 获取对应的加油站名称
        const stationCard = this.closest('.station-card');
        const stationName = stationCard.querySelector('.station-name').textContent;
        
        // 实际应用中这里会调用地图导航API
        console.log(`开始导航至: ${stationName}`);
        
        // 示例：可以通过地图链接实现导航
        // 为了演示，我们可以显示一个导航开始的提示
        const originalText = this.textContent;
        this.textContent = 'Navigating...';
        
        // 设置一个延时，在实际应用中会被实际导航替代
        setTimeout(() => {
          this.textContent = originalText;
          alert(`导航到 ${stationName} 已启动`);
          
          // 实际应用中，这里可以是：
          // - 打开设备地图应用
          // - 使用地图API获取路线
          // - 在站内地图上显示路线等
        }, 1000);
      });
    });
    
    // 燃油类型选择器功能（可选，增强用户体验）
    const fuelType = document.getElementById('fuelType');
    if (fuelType) {
      fuelType.addEventListener('change', function() {
        console.log(`已选择燃油类型: ${this.value}`);
        // 实际应用中可以在这里刷新价格数据
      });
    }
    
    // 计算类型按钮功能（可选）
    const calcButtons = document.querySelectorAll('.calc-type button');
    calcButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 移除所有按钮的active类
        calcButtons.forEach(btn => btn.classList.remove('active'));
        // 为当前点击的按钮添加active类
        this.classList.add('active');
        
        // 更新输入框的提示文本（可选）
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
          alert('请输入数值');
          return;
        }
        
        // 这里可以添加实际的计算逻辑
        console.log(`开始计算，输入值: ${inputValue}`);
        
        // 示例反馈
        alert(`计算完成！您可以查看附近的加油站价格。`);
      });
    }
  });