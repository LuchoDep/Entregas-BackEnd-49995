document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); 

    const userInput = document.getElementById('userInput');
    const messageInput = document.getElementById('messageInput');
    const messageForm = document.getElementById('messageForm');
    const messageList = document.querySelector('.message-list');

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const user = userInput.value.trim();
        const message = messageInput.value.trim();
        if (user && message) {
            socket.emit('message', { user, message });
            messageInput.value = '';
        }
    });

    socket.on('newMessage', (data) => {
        const { user, message } = data;
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="user">${user}:</span><span class="message">${message}</span>`;
        messageList.appendChild(listItem);
    });
});