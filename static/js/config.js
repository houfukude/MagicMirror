var config = {
    lang: 'zh-cn',
    time: {
        timeFormat: 24,
        displaySeconds: true,
        digitFade: false,
    },
    weather: {
        //change weather params here:
        params: {
            q: '',
            //units: metric or imperial
            units: '',
            // if you want a different lang for the weather that what is set above, change it here
            lang: '',
            APPID: 'YOUR_APPID'
        }
    },
    compliments: {
        interval: 30000,
        fadeInterval: 4000,
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
            '今天帅哥对你抛媚眼了么?'
        ]
    },
    calendar: {
        maximumEntries: 15, // Total Maximum Entries
        displaySymbol: true,
        defaultSymbol: 'calendar', // Fontawsome Symbol see http://fontawesome.io/cheatsheet/
        urls: [
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
    news: {
        feed: ''
    },
    todo: {
        api: '',
        entity_id: '',
        token: ''
    }
}

config.init = function () {

    var storage = window.localStorage;

    if (storage.getItem("isSaved") != "true") {
        $('#dialog').show();
    } else {
        $('#dialog').hide();
    }

    config['lang'] = storage.getItem("config.lang");
    config['time']['timeFormat'] = storage.getItem("config.time.timeFormat") == 'on' ? '24' : '12';
    config['time']['displaySeconds'] = storage.getItem("config.time.displaySeconds") == 'on' ? true : false;
    config['time']['digitFade'] = storage.getItem("config.time.digitFade") == 'on' ? true : false;
    config['weather']['params']['q'] = storage.getItem("config.weather.params.q");
    config['weather']['params']['units'] = storage.getItem("config.weather.params.units");
    config['weather']['params']['lang'] = config.lang;
    config['weather']['params']['APPID'] = storage.getItem("config.weather.params.APPID");
    config['news']['feed'] = storage.getItem("config.news.feed");

    config['todo']['api'] = storage.getItem("config.todo.api");
    config['todo']['entity_id'] = storage.getItem("config.todo.entity_id");
    config['todo']['token'] = storage.getItem("config.todo.token");


    const params = new URLSearchParams(window.location.search);
    const config_url = params.get('config'); // 获取 config 参数

    console.log("配置文件地址:", config_url);

    if (config_url) {
        // config_url 是一个 json 文件的地址

        $.ajax({
            url: config_url,
            method: "GET",
            dataType: "json",
            success: function (remoteConfig) {
                // 将远程配置覆盖本地存储配置
                config['lang'] = remoteConfig.lang || storage.getItem("config.lang");
                config['time']['timeFormat'] = (remoteConfig.time?.timeFormat ?? storage.getItem("config.time.timeFormat")) === 'on' ? '24' : '12';
                config['time']['displaySeconds'] = (remoteConfig.time?.displaySeconds ?? storage.getItem("config.time.displaySeconds")) === 'on';
                config['time']['digitFade'] = (remoteConfig.time?.digitFade ?? storage.getItem("config.time.digitFade")) === 'on';
                config['weather']['params']['q'] = remoteConfig.weather?.params?.q || storage.getItem("config.weather.params.q");
                config['weather']['params']['units'] = remoteConfig.weather?.params?.units || storage.getItem("config.weather.params.units");
                config['weather']['params']['lang'] = config.lang;
                config['weather']['params']['APPID'] = remoteConfig.weather?.params?.APPID || storage.getItem("config.weather.params.APPID");
                config['news']['feed'] = remoteConfig.news?.feed || storage.getItem("config.news.feed");

                config['todo']['api'] = remoteConfig.todo?.api || storage.getItem("config.todo.api");
                config['todo']['entity_id'] = remoteConfig.todo?.entity_id || storage.getItem("config.todo.entity_id");
                config['todo']['token'] = remoteConfig.todo?.token || storage.getItem("config.todo.token");

                // 保存远程配置到 localStorage
                storage.setItem("config.lang", config.lang);
                storage.setItem("config.time.timeFormat", remoteConfig.time?.timeFormat ?? storage.getItem("config.time.timeFormat"));
                storage.setItem("config.time.displaySeconds", remoteConfig.time?.displaySeconds ?? storage.getItem("config.time.displaySeconds"));
                storage.setItem("config.time.digitFade", remoteConfig.time?.digitFade ?? storage.getItem("config.time.digitFade"));
                storage.setItem("config.weather.params.q", remoteConfig.weather?.params?.q ?? storage.getItem("config.weather.params.q"));
                storage.setItem("config.weather.params.units", remoteConfig.weather?.params?.units ?? storage.getItem("config.weather.params.units"));
                storage.setItem("config.weather.params.APPID", remoteConfig.weather?.params?.APPID ?? storage.getItem("config.weather.params.APPID"));
                storage.setItem("config.news.feed", remoteConfig.news?.feed ?? storage.getItem("config.news.feed"));

                storage.setItem("config.todo.api", remoteConfig.todo?.api ?? storage.getItem("config.todo.api"));
                storage.setItem("config.todo.entity_id", remoteConfig.todo?.entity_id ?? storage.getItem("config.todo.entity_id"));
                storage.setItem("config.todo.token", remoteConfig.todo?.token ?? storage.getItem("config.todo.token"));

                // 标记已经保存
                storage.setItem("isSaved", "true");

                $('#dialog').hide(); // 成功读取远程配置后隐藏对话框
            }.bind(this),
            error: function (err) {
                console.error("读取远程配置失败:", err);
            }
        })

    }


}
