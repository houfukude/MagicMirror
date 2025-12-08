/**
 * 新闻模块
 * 从RSS订阅源获取新闻标题并循环显示
 * 支持多个RSS源，自动轮播显示
 * 
 * 部分代码来源于原始的feedToJson函数，经过修改支持多RSS源
 * 原始版本：http://airshp.com/2011/jquery-plugin-feed-to-json/
 */
var news = {
    // 本地数据变量（运行时状态，不存储在配置中）
    newsItems: [],               // 未显示的新闻标题数组
    seenNewsItem: [],            // 已显示的新闻标题数组
    
    // 状态变量（运行时状态，不存储在配置中）
    cacheBuster: Math.floor((new Date().getTime()) / 1200 / 1000), // 缓存破坏器，避免缓存
    failedAttempts: 0,           // 连续失败次数计数器
    maxFailedAttempts: 20,       // 最大连续失败次数
    
    // 定时器ID（运行时状态，不存储在配置中）
    intervalId: null,            // 显示更新定时器
    fetchNewsIntervalId: null    // 数据获取定时器
}

/**
 * 构建RSS查询URL
 * 将RSS源地址转换为RSS2JSON API可用的URL
 * 
 * @param {string} feed - 原始RSS订阅源地址
 * @return {string} 转换后的RSS2JSON API URL
 */
news.buildQueryString = function (feed) {
	return config.news.rss2json + encodeURIComponent(feed);
}

/**
 * 获取新闻数据
 * 遍历所有配置的RSS源，逐一获取新闻内容
 */
news.fetchNews = function () {
	// 重置新闻列表，清空之前的数据
	this.newsItems = [];
	
	// 获取配置中的RSS源
	var feeds = config.news.feed;
	
	// 确保feeds是数组格式
	if (typeof feeds === 'string') {
		feeds = [feeds];
	}
	
	// 如果没有配置RSS源，则返回
	if (!feeds || feeds.length === 0) {
		console.warn('未配置 RSS 新闻源');
		return;
	}

	// 遍历每个RSS源并获取数据
	feeds.forEach(function (feedUrl) {
		var _UrlString = this.buildQueryString(feedUrl);
		this.fetchFeed(_UrlString);
	}.bind(this));
}

/**
 * 获取单个RSS源的数据
 * 通过AJAX请求RSS2JSON API获取转换后的JSON数据
 * 
 * @param {string} rssUrl - RSS2JSON API的URL地址
 */
news.fetchFeed = function (rssUrl) {
	// 添加缓存破坏参数，避免浏览器缓存
	var urlWithCache = rssUrl + '&_=' + this.cacheBuster;

	$.ajax({
		type: 'GET',
		datatype: 'jsonp',
		url: urlWithCache,
		timeout: config.news.requestTimeout, // 从配置读取超时时间
		success: function (data) {
			// 检查返回数据是否有效
			if (data && data.items && data.items.length > 0) {
				this.parseFeed(data.items);
				// 重置失败计数器
				this.failedAttempts = 0;
			} else {
				console.warn('RSS源无数据: ' + rssUrl);
			}
		}.bind(this),
		error: function (xhr, status, error) {
			console.error('获取RSS源失败: ' + rssUrl, error);
			// 增加失败计数器
			this.failedAttempts++;
		}.bind(this)
	});
}

/**
 * 解析RSS数据
 * 从返回的JSON数据中提取新闻标题，并合并到新闻列表中
 * 
 * @param {Array} data - RSS解析后的新闻条目数组
 * @return {boolean} 解析是否成功
 */
news.parseFeed = function (data) {
	var _rssItems = [];

	// 遍历新闻条目，提取标题
	for (var i = 0, count = data.length; i < count; i++) {
		var item = data[i];
		
		// 确保标题存在且不为空
		if (item && item.title && item.title.trim() !== '') {
			_rssItems.push(item.title.trim());
		}
	}

	// 将新获取的新闻标题合并到总列表中
	this.newsItems = this.newsItems.concat(_rssItems);
	
	console.log('从RSS源获取到 ' + _rssItems.length + ' 条新闻，总新闻数: ' + this.newsItems.length);

	return true;
}

/**
 * 显示新闻标题
 * 从未显示的新闻列表中随机选择一条进行显示
 * 当所有新闻都显示完后，重置列表重新开始循环
 * 
 * @return {boolean} 显示是否成功
 */
news.showNews = function () {
	// 如果没有未显示的新闻且已显示列表不为空，重置列表
	if (this.newsItems.length === 0 && this.seenNewsItem.length !== 0) {
		this.newsItems = this.seenNewsItem.splice(0); // 将已显示的新闻重新放入未显示列表
		console.log('新闻列表已重置，开始新一轮循环，共 ' + this.newsItems.length + ' 条新闻');
	}

	// 如果没有新闻可显示
	if (this.newsItems.length === 0) {
		// 检查是否连续失败次数过多
		if (this.failedAttempts >= this.maxFailedAttempts) {
			console.error('连续' + this.maxFailedAttempts + '次无法显示新闻，停止尝试');
			return false;
		}

		// 等待3秒后重试
		this.failedAttempts++;
		setTimeout(function () {
			this.showNews();
		}.bind(this), 3000);
		return false;
	}

	// 随机选择一条新闻
	var _randomIndex = Math.floor(Math.random() * this.newsItems.length);
	var _selectedNews = this.newsItems.splice(_randomIndex, 1)[0];

	// 将选中的新闻加入已显示列表
	this.seenNewsItem.push(_selectedNews);

	// 使用淡入淡出效果显示新闻
	$(config.news.newsLocation).updateWithText(_selectedNews, config.news.fadeInterval);
	
	// 重置失败计数器
	this.failedAttempts = 0;

	return true;
}

/**
 * 初始化新闻模块
 * 加载配置，设置定时器，开始新闻获取和显示循环
 * 
 * @return {boolean} 初始化是否成功
 */
news.init = function () {

	// 检查是否配置了RSS源
	var feeds = config.news.feed;
	if (!feeds) {
		console.warn('未配置 RSS 新闻源，新闻模块将被禁用');
		return false;
	}

	// 确保RSS源是数组格式
	if (typeof feeds === 'string') {
		console.log('检测到单个RSS源: ' + feeds);
	} else if (Array.isArray(feeds)) {
		console.log('检测到 ' + feeds.length + ' 个RSS源');
	} else {
		console.error('RSS源配置格式错误，应为字符串或数组');
		return false;
	}

	// 初始获取新闻数据
	this.fetchNews();
	
	// 立即尝试显示一条新闻（如果有数据的话）
	setTimeout(function() {
		this.showNews();
	}.bind(this), 1000);

	// 启动定时获取新闻数据的定时器
	this.fetchNewsIntervalId = setInterval(function () {
		this.fetchNews();
	}.bind(this), config.news.fetchInterval);

	// 启动定时更新显示的定时器
	this.intervalId = setInterval(function () {
		this.showNews();
	}.bind(this), config.news.interval);

	console.log('新闻模块初始化完成，获取间隔: ' + config.news.fetchInterval/1000 + '秒，显示间隔: ' + config.news.interval/1000 + '秒');
	return true;
}