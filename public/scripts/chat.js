const socket = io();

function showStatus(status, message) {
    document.querySelector('[data-status]').innerHTML = message || status;
    document.querySelector('[data-status]').setAttribute('data-status', status);
}

'connect disconnect reconnect reconnecting reconnect_failed'.split(' ').forEach(function (event) {
    socket.on(event, function () {
        showStatus(event);
    })
});

socket.on('error', function (message) {
    console.error(message);
    showStatus('error', message);
});

window.onload = function () {
    const field = document.getElementById('field');
    const form = document.getElementById('form');
    const content = document.getElementById('content');

    form.onsubmit = function () {
        const text = field.value;
        field.value = '';
        socket.emit('send', {message: text});
        return false;
    };

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

    socket.on('logout', function (data) {
        socket.disconnect();
        alert("You logged out");
        window.location.reload();
    });

    socket.emit('hello', {nickname: nickname});
};

window.onunload = function () {
  socket.disconnect();
};