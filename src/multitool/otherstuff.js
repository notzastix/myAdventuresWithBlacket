// commands
multiTool.props.chat.commands = {
  'say': {
    'execute': (msg) => {
      msgtosay = msg.replace(msg.split(' ')[0], '')
      socket.emit('smes', msgtosay)
    }
  },
  'help': {
    execute: async (msg) => {
      alert(`Commands:\nsay - say a message\nhelp - shows this message\nreply - automaticly ping the user with the message`)
    }
  },
  'reply': {
    execute: (msg) => {
      console.log(msg)
      args = msg.split(' ')
      socket.emit('smes', `@${args[1]}, ${msg.replace(args[0], '').replace(args[1], '')}`)
    }
  }
}
// anti xss
socket.off('rmes')
socket.on('rmes', (messageJson) => {
  var messageId = Math.random()
  var messageUserId = Math.random()
  var messageTextId = Math.random()
  if (messageJson.color === 'rainbow') {
    $(".chatBox").append(`<text id="${messageId}" class="chatMessage"><img src="${element}" width="18px" style="margin-right: 0.2%;"><text id="${messageUserId}" style="animation: rainbowText 5s infinite forwards;"></text><text id="${messageTextId}"></text></text>`);
  } else {
    $(".chatBox").append(`<text id="${messageId}" class="chatMessage"><img src="${element}" width="18px" style="margin-right: 0.2%;"><text id="${messageUserId}" style="color: ${messageJson.color}; text-shadow: 0px 0px 25px ${messageJson.color}"></text><text id="${messageTextId}"></text></text>`);
  }
  if (messageJson.message.toLowerCase().includes(userName)) {
    document.getElementById(messageId).style.background = "#2a2e00"
    document.getElementById(messageId).style.filter = "drop-shadow(0px 0px 15px #2a2e00)"
  }
  document.getElementById(messageUserId).textContent = `[${messageJson.role}] ${messageJson.user} > `;
  if (messageJson.user === 'zastix') {
    document.getElementById(messageTextId).innerHTML = messageJson.message;
  } else {
    document.getElementById(messageTextId).textContent = messageJson.message;
  }
  document.querySelector(".chatBox").scrollTop = document.querySelector(".chatBox").scrollHeight;
});
