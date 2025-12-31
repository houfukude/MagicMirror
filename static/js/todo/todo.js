/**
 * TODO 待办事项模块
 * 与 Home Assistant 集成，显示待办事项列表
 */
var todo = {
    // 本地数据变量（运行时状态，不存储在配置中）
    todoItems: [],                // 待办事项数组

    // WebSocket 连接对象
    socket: null,                 // WebSocket 实例
    socket_id: 0,                 // 消息ID计数器，用于匹配请求和响应

    // 定时器ID（运行时状态，不存储在配置中）
    intervalId: null,            // 显示更新定时器
}



/**
 * 认证并连接到 Home Assistant WebSocket
 * 建立连接、发送认证令牌、设置消息处理器
 */
todo.authTODO = function () {
    // 创建 WebSocket 连接
    todo.socket = new WebSocket(config.todo.api);

    // 连接成功回调
    todo.socket.onopen = function () {
        console.log("WebSocket 已连接");

        // 1. 发送认证信息
        todo.socket.send(JSON.stringify({
            type: "auth",
            access_token: config.todo.token
        }));
    };

    // 接收消息回调
    todo.socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("收到消息:", data);

        // 2. 认证成功后立即获取待办事项列表
        if (data.type === "auth_ok") {
            console.log("认证成功，开始获取 todo items");
            todo.fetchTODO();
        }

        // 3. 处理待办事项数据响应
        if (data.type === "result" && data.id === todo.socket_id) {
            // 从响应中提取待办事项列表
            todo.todoItems = data.result.response[config.todo.entity_id].items;
            console.log("Todo 列表：", todo.todoItems);

            // 显示待办事项
            todo.showTODO();
        }
    };

    // 连接错误回调
    todo.socket.onerror = function (err) {
        console.error("WebSocket 错误:", err);
    };

    // 连接关闭回调
    todo.socket.onclose = function () {
        console.log("WebSocket 已关闭");
        // TODO: 可以在这里添加重连逻辑
    };
}

/**
 * 从 Home Assistant 获取待办事项列表
 * 调用 todo.get_items 服务获取指定实体的待办事项
 */
todo.fetchTODO = function () {
    // 递增消息ID，确保每个请求都有唯一标识
    todo.socket_id += 1;

    // 发送服务调用请求到 Home Assistant
    todo.socket.send(JSON.stringify({
        id: todo.socket_id,                    // 消息ID，用于匹配响应
        type: "call_service",             // 消息类型：服务调用
        domain: "todo",                   // 服务域：待办事项
        service: "get_items",             // 服务名称：获取项目列表
        target: {
            entity_id: config.todo.entity_id    // 目标实体ID
        },
        return_response: true           // 要求返回响应数据
    }));
}


/**
 * 显示待办事项列表
 * 过滤已完成的任务，生成HTML并显示在界面上
 * 
 * @returns {boolean} 操作是否成功
 */
todo.showTODO = function () {
    // 先隐藏父容器
    $(todo.todoParent).hide();

    // 如果没有待办事项，直接返回
    if (this.todoItems.length === 0) {
        return false;
    }



    let html = "";

    // 待办事项数据结构示例：
    /*
        this.todoItems=  [{
            "summary": "垃圾纸箱子",
            "uid": "58f14994-c836-11f0-aa5e-88d7f6c31d8d",
            "status": "needs_action",
            "description": "又堆起来了哦"
        },
        {
            "summary": "完成了",
            "uid": "69b5bafa-d40a-11f0-bb54-88d7f6c31d8d",
            "status": "completed"
        },{
            "summary": "垃圾纸箱子",
            "uid": "58f14994-c836-11f0-aa5e-88d7f6c31d8d",
            "status": "needs_action",
            "description": "又堆起来了哦"
        }] 
    */

    // 遍历所有待办事项
    this.todoItems.forEach(item => {
        // 只显示未完成的任务
        if (item.status !== "completed") {
            // 显示任务标题，带待办图标
            html += `
             <span>${item.summary}</span><br/>
            `;

            // 如果有描述信息，也显示出来
            if (item.description) {
                html += `
             <span class="todo-description medium">${item.description}</span><br/>
                `;
            }
        }
    });

    const todoData = html;

    // 如果有待办事项数据，显示父容器
    if (todoData !== "") {
        $(config.todo.todoParent).show();
    }

    // 使用淡入淡出动画更新内容
    $(config.todo.todoLocation).updateWithText(todoData, config.todo.fadeInterval);

    return true;
}

/**
 * 初始化 TODO 模块
 * 加载配置、建立连接、启动定时更新
 * 检查Home Assistant token配置
 * 
 * @return {boolean} 初始化是否成功
 */
todo.init = function () {

    // 初始隐藏待办事项容器
    $(config.todo.todoParent).hide();

    // 检查是否配置了Home Assistant访问令牌
    if (!config.todo.token || config.todo.token === 'YOUR_Home_Assistant_TOKEN') {
        console.warn('未配置 Home Assistant 访问令牌，TODO 模块将被禁用');
        return false;
    }

    // 建立连接并认证
    this.authTODO();

    // 启动定时更新，每隔 fetchInterval 毫秒获取一次数据
    this.intervalId = setInterval(() => {
        this.fetchTODO();
    }, config.todo.fetchInterval);

    return true;
}