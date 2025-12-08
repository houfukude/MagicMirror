/**
 * 天气模块 - 负责显示当前天气和天气预报
 * 从 OpenWeatherMap API 获取天气数据，支持多语言和多种显示布局
 */
var weather = {
	// 运行时状态变量
	intervalId: null  // 定时器ID，用于管理天气数据更新间隔
};

/**
 * 温度值四舍五入到小数点后一位
 * @param {float} temperature - 需要四舍五入的温度值
 * @return {string} - 格式化后的温度字符串，保留一位小数
 */
weather.roundValue = function (temperature) {
	return parseFloat(temperature).toFixed(1);
}

/**
 * 将风速从米/秒转换为蒲福风级等级
 * 蒲福风级：0-12级，用于描述风力强度
 * @see http://www.spc.noaa.gov/faq/tornado/beaufort.html
 * @param {float} ms - 风速（米/秒）
 * @return {int} - 蒲福风级等级（0-12）
 */
weather.ms2Beaufort = function (ms) {
	var kmh = ms * 60 * 60 / 1000; // 转换为公里/小时
	var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000]; // 蒲福风级对应的风速阈值
	for (var beaufort in speeds) {
		var speed = speeds[beaufort];
		if (speed > kmh) {
			return beaufort;
		}
	}
	return 12; // 超过最大阈值时返回12级
}

/**
 * 从 OpenWeatherMap API 获取当前天气数据并更新显示
 * 包括当前温度、天气图标、风速等级、日出日落时间等信息
 */
weather.updateCurrentWeather = function () {
	// 发送 AJAX 请求获取当前天气数据
	$.ajax({
		type: 'GET',
		url: config.weather.apiBase + '/' + config.weather.apiVersion + '/' + config.weather.weatherEndpoint,
		dataType: 'json',
		data: config.weather.params,
		success: function (data) {
			// 处理天气数据：提取温度、风速、图标等信息
			// 从API响应中获取当前温度并格式化为一位小数
			var currentTemperature = this.roundValue(data.main.temp);
			// 获取今日最低温度并格式化
			var dailyMinTemp = this.roundValue(data.main.temp.min);
			// 获取今日最高温度并格式化
			var dailyMaxTemp = this.roundValue(data.main.temp.max);
			// 获取当前风速并格式化，用于后续转换为蒲福风级
			var currentWindSpeed = this.roundValue(data.wind.speed);
			// 根据天气状况获取对应的Weather Icons图标类名
			var weatherIconClass = config.weather.iconTable[data.weather[0].icon];

			// 构建天气图标元素：使用Weather Icons字体库
			var weatherIconElement = '<span class="icon ' + weatherIconClass + ' dimmed wi"></span>';
			// 构建温度显示HTML：图标 + 温度值 + 度数符号
			var temperatureDisplayHtml = weatherIconElement + '' + currentTemperature + '&deg;';

			// 更新温度显示，使用配置的淡入淡出效果
			$(config.weather.temperatureLocation).updateWithText(temperatureDisplayHtml, config.weather.fadeInterval);

			// 计算时间相关信息
			// 获取当前时间的时分格式
			var currentTime = moment().format('HH:mm');
			// 将日出时间戳转换为时分格式
			var sunriseTime = moment(data.sys.sunrise * 1000).format('HH:mm');
			// 将日落时间戳转换为时分格式
			var sunsetTime = moment(data.sys.sunset * 1000).format('HH:mm');

			// 构建显示HTML元素
			// 构建风速显示HTML：风力图标 + 蒲福风级等级
			var windDisplayHtml = '<span class="wind"><span class="wi wi-strong-wind xdimmed"></span> ' + this.ms2Beaufort(currentWindSpeed) + '</span>';
			// 构建日出时间显示HTML：日出图标 + 时间
			var sunriseHtml = '<span class="sun"><span class="wi wi-sunrise xdimmed"></span> ' + sunriseTime + '</span>';

			// 根据当前时间决定显示日出还是日落
			if (sunriseTime < currentTime && sunsetTime > currentTime) {
				// 当前时间在日出日落之间：显示日落时间
				sunriseHtml = '<span class="sun"><span class="wi wi-sunset xdimmed"></span> ' + sunsetTime + '</span>';
			}

			// 更新风速和日照信息显示
			// 更新风速和日照信息显示：风力信息 + 日出日落时间
			$(config.weather.windSunLocation).updateWithText(windDisplayHtml + ' ' + sunriseHtml, config.weather.fadeInterval);

		}.bind(this),
		error: function () {
			// 错误处理（暂时为空）
		}
	});
}

/**
 * 从 OpenWeatherMap API 获取5天天气预报数据并更新显示
 * 支持垂直和水平两种布局模式，显示未来几天的天气趋势
 */
weather.updateWeatherForecast = function () {
	// 发送 AJAX 请求获取天气预报数据
	$.ajax({
		type: 'GET',
		url: config.weather.apiBase + '/' + config.weather.apiVersion + '/' + config.weather.forecastEndpoint,
		data: config.weather.params,
		success: function (data) {
			// 初始化预报显示变量
			// 设置初始透明度，用于创建渐变效果
			var opacity = 1;
			// 初始化预报表格HTML结构
			var forecastHtml = '<table class="forecast-table"><tr>';
			// 初始化星期显示HTML
			var dayHtml = '';
			// 初始化天气图标显示HTML
			var iconHtml = '';
			// 初始化最高温度显示HTML
			var maxTempHtml = '';
			// 初始化最低温度显示HTML
			var minTempHtml = '';

			// 遍历预报数据
			// 获取预报数据总数
			var totalCount = data.list.length;
			// 遍历每一天的预报数据
			for (var i = 0; i < totalCount; i++) {
				// 获取当前循环的预报数据对象
				var forecastData = data.list[i];

				// 根据布局模式重置部分HTML变量
				if (config.weather.orientation == 'vertical') {
					dayHtml = '';
					iconHtml = '';
					maxTempHtml = '';
					minTempHtml = '';
				}

				// 构建预报HTML：星期、天气图标、最高温度、最低温度
				dayHtml += '<td style="opacity:' + opacity + '" class="day">' + moment(forecastData.dt, 'X').format('ddd') + '</td>';
				iconHtml += '<td style="opacity:' + opacity + '" class="icon-small ' + config.weather.iconTable[forecastData.weather[0].icon] + '"></td>';
				maxTempHtml += '<td style="opacity:' + opacity + '" class="temp-max">' + this.roundValue(forecastData.temp.max) + '</td>';
				minTempHtml += '<td style="opacity:' + opacity + '" class="temp-min">' + this.roundValue(forecastData.temp.min) + '</td>';

				// 递减透明度，创建渐变效果
				opacity -= 0.155;

				// 垂直布局模式：每个预报项目占一行
				if (config.weather.orientation == 'vertical') {
					forecastHtml += dayHtml + iconHtml + maxTempHtml + minTempHtml + '</tr>';
				}
			}

			// 完成HTML构建
			if (config.weather.orientation == 'vertical') {
				forecastHtml += '</table>';
			} else {
				// 水平布局模式：将所有行组合到一起
				forecastHtml += '</tr>' + dayHtml + '</tr>' + iconHtml + '</tr>' + maxTempHtml + '</tr>' + minTempHtml + '</table>';
			}

			// 更新天气预报显示
			$(config.weather.forecastLocation).updateWithText(forecastHtml, config.weather.fadeInterval);

		}.bind(this),
		error: function () {
			// 错误处理（暂时为空）
		}
	});
}

/**
 * 初始化天气模块
 * 设置语言参数，启动定时更新机制，并立即获取一次天气数据
 * 检查OpenWeatherMap API密钥配置
 * 
 * @return {boolean} 初始化是否成功
 */
weather.init = function () {
	// 检查是否配置了OpenWeatherMap API密钥
	if (!config.weather.params.APPID || config.weather.params.APPID === 'YOUR_APPID') {
		console.warn('未配置 OpenWeatherMap API 密钥，天气模块将被禁用');
		return false;
	}

	// 确保天气参数的语言设置与全局配置一致
	if (config.weather.params.lang === undefined || config.weather.params.lang === '') {
		config.weather.params.lang = config.lang;
	}

	// 设置默认预报天数（如果未设置）
	if (config.weather.params.cnt === undefined) {
		config.weather.params.cnt = config.weather.params.cnt || 6;
	}

	// 启动定时更新机制
	this.intervalId = setInterval(function () {
		this.updateCurrentWeather();
		this.updateWeatherForecast();
	}.bind(this), config.weather.updateInterval);

	// 立即获取并显示天气数据
	this.updateCurrentWeather();
	this.updateWeatherForecast();

	return true;
}
