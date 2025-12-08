/**
 * MagicMirror 全局配置对象
 * 管理所有模块的配置参数，支持本地存储和远程配置
 */
var config = {
    // 语言设置：zh-cn（简体中文）、en（英文）等
    lang: 'zh-cn',

    // 时间模块配置
    time: {
        // DOM 选择器
        dateLocation: '.date',   // 日期显示容器
        timeLocation: '#time',   // 时间显示容器

        timeFormat: 'HH',        // 时间格式：'HH'（24小时制）或 'hh'（12小时制）
        displaySeconds: true,    // 是否显示秒数
        digitFade: false,        // 是否启用数字淡入淡出动画效果
        updateInterval: 1000,    // 时间更新间隔：1秒（毫秒）
    },

    // 天气模块配置
    weather: {
        // OpenWeatherMap API 参数
        params: {
            q: 'chongqing,china',              // 城市名称，格式：城市名,国家代码（如：chongqing,china）
            units: 'metric',                   // 单位制：metric（摄氏度）或 imperial（华氏度）
            lang: 'zh_cn',                     // 天气信息显示语言，默认中文
            APPID: 'YOUR_APPID',               // OpenWeatherMap API 密钥
            cnt: 6                             // 预报天数
        },

        // API 配置
        apiVersion: '2.5',                    // API 版本
        apiBase: 'https://api.openweathermap.org/data/',  // API 基础地址
        weatherEndpoint: 'weather',           // 当前天气端点
        forecastEndpoint: 'forecast/daily',   // 天气预报端点

        // DOM 选择器
        temperatureLocation: '.temp',          // 温度显示容器
        windSunLocation: '.windsun',           // 风速日照显示容器
        forecastLocation: '.forecast',        // 天气预报显示容器

        // 时间间隔配置（毫秒）
        updateInterval: 60000,                 // 更新间隔：60秒
        fadeInterval: 6000,                    // 淡入淡出时间：6秒

        // 显示配置
        orientation: 'vertical',               // 预报布局：vertical（垂直）或 horizontal（水平）

        // 天气图标映射表（OpenWeatherMap图标 -> Weather Icons图标）
        iconTable: {
            '01d': 'wi-day-sunny',           // 晴天
            '02d': 'wi-day-cloudy',          // 少云
            '03d': 'wi-cloudy',              // 多云
            '04d': 'wi-cloudy-windy',        // 阴天
            '09d': 'wi-showers',             // 阵雨
            '10d': 'wi-rain',                // 雨
            '11d': 'wi-thunderstorm',        // 雷暴
            '13d': 'wi-snow',                // 雪
            '50d': 'wi-fog',                 // 雾
            '01n': 'wi-night-clear',         // 夜晴
            '02n': 'wi-night-cloudy',        // 夜少云
            '03n': 'wi-night-cloudy',        // 夜多云
            '04n': 'wi-night-cloudy',        // 夜阴天
            '09n': 'wi-night-showers',       // 夜阵雨
            '10n': 'wi-night-rain',          // 夜雨
            '11n': 'wi-night-thunderstorm',  // 夜雷暴
            '13n': 'wi-night-snow',          // 夜雪
            '50n': 'wi-night-alt-cloudy-windy' // 夜雾
        }
    },

    // 恭维语模块配置
    compliments: {
        // DOM 选择器
        complimentLocation: '.compliment',
        interval: 30000,         // 切换间隔时间：30秒
        fadeInterval: 4000,     // 淡入淡出动画时间：4秒

        // 不同时段的恭维语列表
        morning: [
            '早上好，美女！',
            '祝您愉快!',
            '昨晚睡得怎么样?',
            '淫荡的一天又开始了！',
            '今天是个美好的一天！',
            '今天看起来很棒！',
            '早上好呀，心情怎么样？',
            '早安，小可爱！',
            '睡得好吗？今天又可以闪闪发光啦！'
        ],
        afternoon: [
            '你好, 大美女!',
            '你今天看起来真性感!',
            '你今天看起来真完美!'
        ],
        evening: [
            '哇, 你今天真是火辣!',
            '你看起来真是养眼!',
            'Hi, sexy!',
            '完美无缺',
            '今晚想来点刺激的吗？',
            '今天有帅哥对你抛媚眼了么?'
        ]
    },

    // 日历模块配置（当前已禁用）
    calendar: {
        maximumEntries: 15,        // 最大显示条目数
        displaySymbol: true,       // 是否显示图标
        defaultSymbol: 'calendar', // 默认图标名称（FontAwesome）
        urls: [                    // 日历URL列表（支持多个.ics文件）
            // {
            //     symbol: 'calendar-plus-o',
            //     url: './static/ics/1.ics'
            // },
            // {
            //     symbol: 'certificate',
            //     url: './static/ics/2.ics'
            // },
            // {
            // 	symbol: 'moon-o',
            // 	url: "https://calendar.google.com/calendar/ical/ug2j3l2nqq7uch3m9n0pm5t2lo%40group.calendar.google.com/public/basic.ics",
            // },
            // {
            // symbol: 'venus',
            // url: "https://server/url/to/hers.ics",
            // },
            // {
            // symbol: 'venus-mars',
            // url: "https://server/url/to/theirs.ics",
            // },
        ]
    },

    // 新闻模块配置
    news: {
        // DOM 选择器
        newsLocation: '.news',   // 新闻显示容器

        // RSS转换服务配置
        rss2json: 'https://api.rss2json.com/v1/api.json?rss_url=',  // RSS转JSON服务地址

        // 其他配置
        feed: 'https://feedx.net/rss/nytimes.xml',                // RSS订阅源URL（字符串或数组）
        requestTimeout: 10000,    // 请求超时时间：10秒

        // 时间间隔配置（毫秒）
        fadeInterval: 2000,      // 淡入淡出动画时间：2秒
        fetchInterval: 60000,    // 数据获取间隔：60秒
        interval: 5500,          // 显示更新间隔：5.5秒

    },

    // TODO 待办事项模块配置
    todo: {
        // DOM 选择器
        todoLocation: '.todo',        // 待办事项内容容器
        todoParent: '.lower-todo',     // 待办事项父容器

        // 时间间隔配置（毫秒）
        fetchInterval: 5000,          // 数据获取间隔：5秒
        updateInterval: 5000,         // 更新间隔：5秒
        fadeInterval: 1500,           // 淡入淡出动画时间：1.5秒

        // Home Assistant 连接配置
        api: 'ws://homeassistant.local:8123/api/websocket', // Home Assistant WebSocket API
        entity_id: 'todo.shopping_list', // 待办事项实体ID
        token: 'YOUR_Home_Assistant_TOKEN'                // Home Assistant 访问令牌
    }
}

/**
 * 初始化配置系统
 * 按优先级加载配置：远程配置 > 本地存储 > 默认配置
 * 支持URL参数指定远程配置文件地址
 */
config.init = function () {
    // 获取本地存储对象
    var storage = window.localStorage;

    // 检查是否已完成初次配置
    if (storage.getItem("isSaved") != "true") {
        $('#dialog').show();  // 显示配置提示对话框
    } else {
        $('#dialog').hide();  // 隐藏配置提示对话框
    }

    // 第一阶段：从本地存储加载配置
    this.loadFromLocalStorage(storage);

    // 第二阶段：检查是否有远程配置参数
    const params = new URLSearchParams(window.location.search);
    const config_url = params.get('config'); // 获取URL中的config参数

    console.log("配置文件地址:", config_url);

    // 如果指定了远程配置文件，则加载并覆盖本地配置
    if (config_url) {
        this.loadRemoteConfig(config_url, storage);
    }
}

/**
 * 从本地存储加载配置
 * @param {Storage} storage - localStorage对象
 */
config.loadFromLocalStorage = function (storage) {
    // 加载基础配置
    config['lang'] = storage.getItem("config.lang");

    // 加载时间配置
    config['time']['timeFormat'] = storage.getItem("config.time.timeFormat") || config.time.timeFormat; // 直接存储 'HH' 或 'hh'
    config['time']['displaySeconds'] = storage.getItem("config.time.displaySeconds") === null ? config.time.displaySeconds : (storage.getItem("config.time.displaySeconds") === 'true');
    config['time']['digitFade'] = storage.getItem("config.time.digitFade") === null ? config.time.digitFade : (storage.getItem("config.time.digitFade") === 'true');

    // 加载天气配置
    config['weather']['params']['q'] = storage.getItem("config.weather.params.q");
    config['weather']['params']['units'] = storage.getItem("config.weather.params.units");
    config['weather']['params']['lang'] = config.lang; // 天气语言跟随全局语言设置
    config['weather']['params']['APPID'] = storage.getItem("config.weather.params.APPID");

    // 加载新闻配置
    config['news']['feed'] = storage.getItem("config.news.feed");

    // 加载TODO配置
    config['todo']['api'] = storage.getItem("config.todo.api");
    config['todo']['entity_id'] = storage.getItem("config.todo.entity_id");
    config['todo']['token'] = storage.getItem("config.todo.token");
}

/**
 * 加载远程配置文件
 * @param {string} configUrl - 远程配置文件的URL
 * @param {Storage} storage - localStorage对象
 */
config.loadRemoteConfig = function (configUrl, storage) {
    // 使用AJAX获取远程配置文件
    $.ajax({
        url: configUrl,
        method: "GET",
        dataType: "json",
        success: function (remoteConfig) {
            console.log("成功加载远程配置:", remoteConfig);

            // 合并远程配置和本地存储配置（远程配置优先）
            this.mergeRemoteConfig(remoteConfig, storage);

            // 标记配置已保存
            storage.setItem("isSaved", "true");

            // 隐藏配置对话框
            $('#dialog').hide();

        }.bind(this),
        error: function (err) {
            console.error("读取远程配置失败:", err);
            // 远程配置失败时继续使用本地配置
        }
    });
}

/**
 * 合并远程配置到当前配置并保存到本地存储
 * @param {Object} remoteConfig - 远程配置对象
 * @param {Storage} storage - localStorage对象
 */
config.mergeRemoteConfig = function (remoteConfig, storage) {
    // 合并基础配置
    config['lang'] = remoteConfig.lang || storage.getItem("config.lang");

    // 合并时间配置
    config['time']['timeFormat'] = remoteConfig.time?.timeFormat ?? storage.getItem("config.time.timeFormat") ?? config.time.timeFormat;
    config['time']['displaySeconds'] = remoteConfig.time?.displaySeconds ?? storage.getItem("config.time.displaySeconds") ?? config.time.displaySeconds;
    config['time']['digitFade'] = remoteConfig.time?.digitFade ?? storage.getItem("config.time.digitFade") ?? config.time.digitFade;

    // 合并天气配置
    config['weather']['params']['q'] = remoteConfig.weather?.params?.q || storage.getItem("config.weather.params.q");
    config['weather']['params']['units'] = remoteConfig.weather?.params?.units || storage.getItem("config.weather.params.units");
    config['weather']['params']['lang'] = config.lang; // 保持天气语言跟随全局语言
    config['weather']['params']['APPID'] = remoteConfig.weather?.params?.APPID || storage.getItem("config.weather.params.APPID");

    // 合并新闻配置
    config['news']['feed'] = remoteConfig.news?.feed || storage.getItem("config.news.feed");

    // 合并TODO配置
    config['todo']['api'] = remoteConfig.todo?.api || storage.getItem("config.todo.api");
    config['todo']['entity_id'] = remoteConfig.todo?.entity_id || storage.getItem("config.todo.entity_id");
    config['todo']['token'] = remoteConfig.todo?.token || storage.getItem("config.todo.token");

    // 将合并后的配置保存到本地存储，以便下次使用
    this.saveToLocalStorage(remoteConfig, storage);
}

/**
 * 保存配置到本地存储
 * @param {Object} remoteConfig - 配置对象
 * @param {Storage} storage - localStorage对象
 */
config.saveToLocalStorage = function (remoteConfig, storage) {
    // 保存基础配置
    storage.setItem("config.lang", config.lang);

    // 保存时间配置
    storage.setItem("config.time.timeFormat", config.time.timeFormat); // 直接存储 'HH' 或 'hh'
    storage.setItem("config.time.displaySeconds", config.time.displaySeconds); // 直接存储布尔值
    storage.setItem("config.time.digitFade", config.time.digitFade); // 直接存储布尔值

    // 保存天气配置
    storage.setItem("config.weather.params.q", remoteConfig.weather?.params?.q ?? storage.getItem("config.weather.params.q"));
    storage.setItem("config.weather.params.units", remoteConfig.weather?.params?.units ?? storage.getItem("config.weather.params.units"));
    storage.setItem("config.weather.params.APPID", remoteConfig.weather?.params?.APPID ?? storage.getItem("config.weather.params.APPID"));

    // 保存新闻配置
    storage.setItem("config.news.feed", remoteConfig.news?.feed ?? storage.getItem("config.news.feed"));

    // 保存TODO配置
    storage.setItem("config.todo.api", remoteConfig.todo?.api ?? storage.getItem("config.todo.api"));
    storage.setItem("config.todo.entity_id", remoteConfig.todo?.entity_id ?? storage.getItem("config.todo.entity_id"));
    storage.setItem("config.todo.token", remoteConfig.todo?.token ?? storage.getItem("config.todo.token"));
}
