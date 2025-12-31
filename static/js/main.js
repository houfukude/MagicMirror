jQuery.fn.updateWithText = function (text, speed) {
	var dummy = $('<div/>').html(text);

	if ($(this).html() != dummy.html()) {
		$(this).fadeOut(speed / 2, function () {
			$(this).html(text);
			$(this).fadeIn(speed / 2, function () {
				//done
			});
		});
	}
}

jQuery.fn.outerHTML = function (s) {
	return s
		? this.before(s).remove()
		: jQuery("<p>").append(this.eq(0).clone()).html();
};

function roundVal(temp) {
	return Math.round(temp * 10) / 10;
}

function rotateDisplay() {
	// 获取 URL 查询参数
	const params = new URLSearchParams(window.location.search);
	const rotate = params.get('rotate'); // 获取 rotate 参数

	if (rotate) {
		// 根据参数值旋转页面
		const degree = parseInt(rotate);
		if (!isNaN(degree)) {
			document.body.style.transform = `rotate(${degree}deg)`;

			// 旋转 90/270 度时，需要调整 body 尺寸和位置
			if (degree % 180 !== 0) {
				document.body.style.width = '100vh';
				document.body.style.height = '100vw';

				document.body.style.top = '0';
				document.body.style.left = '0';
			}
		}
	}
}

jQuery(document).ready(function ($) {

	var eventList = [];

	var lastCompliment;
	var compliment;


	moment.locale(config.lang);

	rotateDisplay();
	//connect do Xbee monitor
	// var socket = io.connect('http://rpi-alarm.local:8082');
	// socket.on('dishwasher', function (dishwasherReady) {
	// 	if (dishwasherReady) {
	// 		$('.dishwasher').fadeIn(2000);
	// 		$('.lower-third').fadeOut(2000);
	// 	} else {
	// 		$('.dishwasher').fadeOut(2000);
	// 		$('.lower-third').fadeIn(2000);
	// 	}
	// });

	//version.init();

	config.init();

	time.init();

	//calendar.init();

	compliments.init();

	weather.init();

	news.init();

	todo.init();

	background.init();

});
