var config = {
    lang: 'en',
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
            '淫荡的一天又开始了！'
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
            '完美无缺'
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
    }
}

var storage = window.localStorage;
if(storage.length<9){
    $('#dialog').show();
}
config['lang'] = storage.getItem("config.lang");
config['time']['timeFormat'] = storage.getItem("config.time.timeFormat") == 'on'?'24':'12';
config['time']['displaySeconds'] = storage.getItem("config.time.displaySeconds") == 'on'?true:false;
config['time']['digitFade'] = storage.getItem("config.time.digitFade") == 'on'?true:false;
config['weather']['params']['q'] = storage.getItem("config.weather.params.q");
config['weather']['params']['units'] = storage.getItem("config.weather.params.units");
config['weather']['params']['lang'] = config.lang;
config['weather']['params']['APPID'] = storage.getItem("config.weather.params.APPID");
config['news']['feed'] = storage.getItem("config.news.feed");
