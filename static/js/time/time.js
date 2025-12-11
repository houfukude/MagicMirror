/**
 * 时间模块 - 负责显示当前时间和日期
 * 支持12/24小时制、秒数显示、数字淡入淡出动画效果
 */
var time = {
	// 定时器ID（运行时状态，不存储在配置中）
	intervalId: undefined        // 定时器ID，用于管理时间更新间隔
};

/**
 * 更新屏幕上显示的时间
 * 根据配置决定是否显示秒数、是否启用数字动画效果
 * 动态调整更新策略：显示秒数时每秒更新，不显示时每分钟更新
 */
time.updateTime = function () {
	var _now = moment();  // 获取当前时间对象
	
	// 生成日期格式：星期几, 完整日期
	var _date = _now.format('[<span class="dayname">]dddd,[</span> <span class="longdate">]LL[</span>]');
	
	// 更新日期显示，使用1秒的淡入淡出效果
	$(config.time.dateLocation).updateWithText(_date, 1000);
	
	// 清除之前的淡入淡出标记
	$('.fade').removeClass('fade');
	
	var html = '';  // 时间HTML内容
	
	if (config.time.displaySeconds) {
		// 显示秒数模式：每秒更新一次
		html = _now.format(config.time.timeFormat + ':mm').replace(/./g, '<span class="digit">$&</span>') +
			'<span class="sec">' + _now.format('ss').replace(/./g, '<span class="digit">$&</span>') + '</span>';
		
		// 如果定时器未启动，则启动配置间隔的定时器
		if (typeof this.intervalId == 'undefined') {
			this.intervalId = setInterval(function () {
				this.updateTime();
			}.bind(this), config.time.updateInterval);
		}
	} else {
		// 不显示秒数模式：每分钟更新一次
		html = _now.format(config.time.timeFormat + ':mm').replace(/./g, '<span class="digit">$&</span>');
		
		// 清除现有的定时器
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}
		
		// 计算到下一分钟的剩余秒数，在整分钟时更新
		var seconds = 60 - (new Date()).getSeconds();
		setTimeout(function () {
			this.updateTime();
		}.bind(this), seconds * 1000);
	}
	
	if (config.time.digitFade) {
		// 启用数字淡入淡出动画效果
		var diff = $('<div>').html(html);
		
		// 比较新旧时间的每个数字，标记需要变化的数字
		diff.find('.digit').each(function (index) {
			var _text = $(this).text();
			var liveNode = $(config.time.timeLocation).find('.digit')[index];
			
			if (typeof liveNode != 'undefined') {
				liveNode = $(liveNode);
				var _text2 = liveNode.text();
				if (_text != _text2) {
					// 数字发生变化，添加淡入淡出标记
					liveNode.addClass('fade');
					$(this).addClass('fade');
				}
			} else {
				// 新增的数字，添加淡入淡出标记
				$(this).addClass('fade');
			}
		});
		
		if ($('.fade').length == 0) {
			// 首次更新或无变化，直接更新HTML
			$(config.time.timeLocation).html(diff.html());
			diff = undefined;
		} else {
			// 有变化的数字，执行淡入淡出动画
			$('.fade').fadeTo(400, 0.25, function () {
				if (typeof diff != 'undefined') {
					$(config.time.timeLocation).html(diff.html());
					diff = undefined;
				}
				$('.fade').fadeTo(400, 1).removeClass('fade');
			}.bind(this));
		}
	} else {
		// 不启用动画效果，直接更新显示
		if (config.time.displaySeconds) {
			$(config.time.timeLocation).html(_now.format(config.time.timeFormat + ':mm[<span class="sec">]ss[</span>]'));
		} else {
			$(config.time.timeLocation).html(_now.format(config.time.timeFormat + ':mm'));
		}
	}
}

/**
 * 初始化时间模块
 * 启动时间显示，时间格式直接从配置中读取
 */
time.init = function () {
	// 直接使用配置中的时间格式，不再进行转换计算
	// 配置值：'HH'（24小时制）或 'hh'（12小时制）
	
	// 立即更新一次时间显示
	this.updateTime();
}