$(function () {
  
  const socket = io.connect("http://localhost:3000");
  
  const message = $("#message");
  const username = $("#username");
  const userRoom = $("#user_room");
  const send_message = $("#send_message");
  const connection = $("#connection");
  const chatroom = $("#chatroom");
  const feedback = $("#feedback");
  
  const historyChatWindow = document.querySelector(".history_chat_window");
  const buttonHistoryChat = document.querySelector(".button-history-chat");
  const historyChat = document.querySelector(".history-chat-text");
  const buttonCloseHistoryChat = document.querySelector(".button-close-history-chat");

  let arrayMessages = [];

  function changeUserConnectionStatus() {
    socket.on("connect", () => {
      connection[0].innerHTML = 'online'
      document.querySelector('#connection').style.backgroundColor = 'green';
    });

    socket.on("disconnect", () => {
      connection[0].innerHTML = 'offline'
      document.querySelector('#connection').style.backgroundColor = 'red';
    });

    connection.click(() => {
      if(!socket.connected) {
        socket.connected = true;
        connection[0].innerHTML = 'online'
        document.querySelector('#connection').style.backgroundColor = 'green';
      } else {
        socket.connected = false;
        connection[0].innerHTML = 'offline'
        document.querySelector('#connection').style.backgroundColor = 'red';
      }
    });
  }

  send_message.click(() => {
    toMessage(); 
  });

  message.keydown((e) => {
    if(e.keyCode === 13) {
      toMessage();
    }
  });

  function toMessage() {
    socket.emit('create', userRoom.val());
    socket.emit("change_username", { username: username.val() || "Anonymous" });
    if(message.val()) {
      socket.emit("new_message", {
        message: message.val(),
        className: alertClass
      });
    }
  }

  buttonHistoryChat.addEventListener('click', () => {
    historyChatWindow.style.display = 'block';
    historyChat.innerHTML = arrayMessages.join('<br>');
  });

  buttonCloseHistoryChat.addEventListener('click', () => {
    historyChatWindow.style.display = 'none';
  });

  const min = 1;
  const max = 6;
  const random = Math.floor(Math.random() * (max - min)) + min;

  let alertClass;
  switch (random) {
    case 1:
      alertClass = "secondary";
      break;
    case 2:
      alertClass = "danger";
      break;
    case 3:
      alertClass = "success";
      break;
    case 4:
      alertClass = "warning";
      break;
    case 5:
      alertClass = "info";
      break;
    case 6:
      alertClass = "light";
      break;
  }

  socket.on("add_mess", data => {
    if(userRoom.val() === data.roomUsers) {
      arrayMessages = data.arrayMessages;   
      feedback.html("");
      message.val("");
      chatroom.append(
        "<div class='alert alert-" +
          data.className +
          "'<b>" +
          data.username +
          "</b>: " +
          data.message +
          "</div>"
      );
    }   
  });

  message.bind("keypress", () => {
    socket.emit('create', userRoom.val());
    socket.emit("typing");
  });

  socket.on("typing", data => {
    if (userRoom.val() === data.roomUsers) { 
      feedback.html(
       "<p><i>" + data.username + " печатает сообщение..." + "</i></p>"
      );
      setTimeout(() => {
        feedback.html("");
      }, 700); 
    }
  });

changeUserConnectionStatus(); 
toMessage();
});
