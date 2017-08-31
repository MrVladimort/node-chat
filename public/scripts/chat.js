const socket = io();

// показываем статусы сокета склоняясь на ивенты которые он запускает
function showStatus(status, message) {
    document.querySelector('[data-status]').innerHTML = message || status;
    document.querySelector('[data-status]').setAttribute('data-status', status);
}

// задаем статусы
'connect disconnect reconnect reconnecting reconnect_failed'.split(' ').forEach(function (event) {
    // прослушиваем ивенты сервера из нашего массива
    socket.on(event, function () {
        showStatus(event);
    })
});

socket.on('error', function (message) {
    console.error(message);
    showStatus('error', message);
});

// будет выполнено после полной загрузки страицы со всеми ее компонентами
window.onload = function () {
    // получаем айди наших основных обьектов страницы
    const field = document.getElementById('field');
    const form = document.getElementById('form');
    const content = document.getElementById('content');

    // при подтверждении эмитим собитие send и одправляем данные из поля на сервер
    form.onsubmit = function () {
        const text = field.value;
        field.value = '';
        socket.emit('send', {message: text});
        return false;
    };

    // массив сообщений для записи в форму
    const messages = [];
    socket.on('message', function (data) {
        if (data.message) {
            messages.push(data.message);
            let html = '';
            for (let i = 0; i < messages.length; i++)
                html += messages[i] + '<br/>';
            content.innerHTML = html;
        } else {
            console.log('Something bad');
        }
    });

    // logout ведет за собой уничтожение сессий и проблемы
    socket.on('logout', function () {
        socket.disconnect();
        window.location.reload();
    });

    // при подключении эмитим привествие
    socket.emit('hello', {nickname: nickname});
};

// при закрытии окна дисконектим сокет
window.onunload = function () {
    socket.disconnect();
};