/**
 * 恭维语模块 - 负责在不同时段显示随机的恭维语
 * 根据当前时间选择对应时段的恭维语列表，并随机显示避免重复
 */
var compliments = {
	// 运行时状态变量 （运行时状态，不存储在配置中）
	currentCompliment: '',    // 当前显示的恭维语内容
	// 定时器ID（运行时状态，不存储在配置中）
	intervalId: null          // 定时器ID，用于管理更新间隔
};

/**
 * 更新屏幕上显示的恭维语
 * 根据当前时间段选择对应的恭维语列表，随机选择一条新的恭维语显示
 * 避免连续重复显示同一条恭维语
 */
compliments.updateCompliment = function () {
	var _list = [];           // 当前时段可选的恭维语列表
	var hour = moment().hour(); // 获取当前小时数（0-23）

	// 根据时间段选择对应的恭维语列表
	// 使用 .slice() 创建数组的值副本，保护原始数组不被修改
	if (hour >= 3 && hour < 12) {
		// 早晨时段：3:00 - 11:59
		_list = config.compliments.morning.slice();
	} else if (hour >= 12 && hour < 17) {
		// 下午时段：12:00 - 16:59
		_list = config.compliments.afternoon.slice();
	} else if (hour >= 17 || hour < 3) {
		// 晚上时段：17:00 - 2:59
		_list = config.compliments.evening.slice();
	} else {
		// 异常情况：从所有时段的恭维语中随机选择
		Object.keys(config.compliments).forEach(function (_curr) {
			if (Array.isArray(config.compliments[_curr])) {
				_list = _list.concat(config.compliments[_curr]).slice();
			}
		});
	}

	// 查找当前恭维语在列表中的位置
	var _spliceIndex = _list.indexOf(compliments.currentCompliment);

	// 如果找到了当前恭维语，将其从列表中移除以避免重复
	if (_spliceIndex !== -1) {
		_list.splice(_spliceIndex, 1);
	}

	// 从剩余列表中随机选择一条恭维语
	var _randomIndex = Math.floor(Math.random() * _list.length);
	compliments.currentCompliment = _list[_randomIndex];

	// 使用配置中的淡入淡出效果更新显示
	$(config.compliments.complimentLocation).updateWithText(compliments.currentCompliment, config.compliments.fadeInterval);
}

/**
 * 初始化恭维语模块
 * 启动时立即显示一条恭维语，并设置定时更新机制
 * 根据localStorage的isSaved状态决定是否启用模块
 * 
 * @return {boolean} 初始化是否成功
 */
compliments.init = function () {
	// 检查配置是否已完成设置
	try {
		var storage = window.localStorage;
		if (storage && storage.getItem("isSaved") !== "true") {
			console.warn('配置未完成，恭维语模块将被禁用');
			return false;
		}
	} catch (error) {
		console.warn('无法访问localStorage，恭维语模块将被禁用', error);
		return false;
	}

	// 立即显示第一条恭维语
	this.updateCompliment();

	// 设置定时器，按照配置的间隔时间更新恭维语
	this.intervalId = setInterval(function () {
		this.updateCompliment();
	}.bind(this), config.compliments.interval);

	return true;
}