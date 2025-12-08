var todo = {
    todoLocation: '.todo',
    todoParent: '.lower-todo',
    todoItems: [],
    api: "ws://homeassistant.local:8123/api/websocket",
    token: null,
    entity_id: "todo.bei_wang_lu",
    fetchInterval: 5000,
    updateInterval: 5000,
}

var socket;
var socket_id = 0;

todo.authTODO = function () {
    socket = new WebSocket(todo.api);

    socket.onopen = function () {
        console.log("WebSocket 已连接");

        // 1. 认证
        socket.send(JSON.stringify({
            type: "auth",
            access_token: todo.token
        }));
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log("收到消息:", data);

        // 2. 认证成功后请求 todo 列表
        if (data.type === "auth_ok") {
            console.log("认证成功，开始获取 todo items");
            todo.fetchTODO();
        }

        // 3. 收到返回实体状态
        if (data.type === "result" && data.id === socket_id) {
            todo.todoItems = data.result.response[todo.entity_id].items;
            console.log("Todo 列表：", todo.todoItems);

            todo.showTODO();

        }
    };

    socket.onerror = function (err) {
        console.error("WebSocket 错误:", err);
    };

    socket.onclose = function () {
        console.log("WebSocket 已关闭");
    };
}

todo.fetchTODO = function () {
    socket_id += 1;
    // 发送 command 请求实体信息
    socket.send(JSON.stringify({
        id: socket_id,
        type: "call_service",
        domain: "todo",
        service: "get_items",
        target: {
            entity_id: todo.entity_id
        },
        "return_response": true

    }));
}


todo.showTODO = function () {
    $(todo.todoParent).hide();
    if (this.todoItems.length === 0) {
        return false;
    }


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
    // TODO 显示的待办事项

    let html = "";

    this.todoItems.forEach(item => {

        if (item.status !== "completed") {
            html += `
             <span >🔜 ${item.summary}</span><br/>
            `;
            if (item.description) {
                html += `
             <span class="todo-description medium">${item.description}</span><br/>
                `;
            }
        }



    });

    const todoData = html;

    if (todoData !== "") {
        $(todo.todoParent).show();
    }

    $(this.todoLocation).updateWithText(todoData, this.fadeInterval);

    return true;

}

todo.init = function () {
    $(todo.todoParent).hide();
    this.api = config.todo.api;
    this.token = config.todo.token;
    this.entity_id = config.todo.entity_id;

    this.authTODO();

    this.intervalId = setInterval(function () {
        this.fetchTODO();
    }.bind(this), this.fetchInterval);
}