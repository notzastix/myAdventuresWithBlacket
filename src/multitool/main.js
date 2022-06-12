var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
$('head').append('<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>')
multiTool = {
  socket: {},
  utils: {
    encode: (str) => {
      pt = pt.split('').reverse()
      for (i = 0; i < pt.length; i++) {
        if (key[i]) pt[i] = pt[i].charCodeAt() + key[i]
        else pt[i] = pt[i].charCodeAt() + key[0]
        pt[i] = String.fromCharCode(pt[i])
      }
      return pt.join('')
    },
    sanitize: (e) => {
      e = e.toString()
      return e;
    }
  },
  alert: function() {
    this.setError = function() {
      this.props.isError = !this.props.isError
    }
    this.hide = function() {
      if (!this.props.isAppended) {
        throw new Error('You need to show the element before hiding it.')
        return;
      }
      this.props.isAppended = false
      $('#multitoolAlert').remove();
    }
    this.forceUpdate = function() {
      if (this.props.isAppended) {
        if ($('#multitoolAlert').length == 0) this.show(true)
        $('#Multitoolreason').text(this.props.desc)
      } else {
        if ($('#multitoolAlert').length > 0) $('#multitoolAlert').remove();
      }

    }
    this.setDesc = function(s) {
      this.props.desc = multiTool.utils.sanitize(s);
      if (this.props.isAppended) $('#Multitoolreason').text(this.props.desc)
    }
    this.show = function(force) {
      if (this.props.isAppended && !force) return;
      if (this.props.desc == null) {
        throw new Error('You need to set the description before showing alert.')
        return;
      }
      if (this.props.isError) errorElem = 'box-shadow: 0px 0px 15px darkred;'
      else errorElem = ''
      $('body').append(`<div id='multitoolAlert' style="${errorElem}animation: zoomInErrorPopup 1s 0s ease forwards;position: absolute;width: 50vw;border-radius: 2vh;height: 50vh;left: 25vw;top: 25vh;background-color: rgb(28, 29, 28);">
    <text style="position:absolute;font-size:6.4vw;left:12vw;top:0vh;font-family:jua;color:rgb(255,254,235);text-shadow:rgb(0 0 0) 0 0 15px;">Multitool</text>
    <text style="font-size:${this.props.fontSize}vw;text-align:center;font-family:jua;display:block;transform:translateY(17vh);color:rgb(255,254,235);text-shadow:rgb(0 0 0) 0 0 15px;" id='Multitoolreason'>${multiTool.utils.sanitize(this.props.desc)}</text>
    <button id='multiToolHideBtn' style="border-radius: 0.85vw; border: 0vw solid rgb(255, 255, 255); width: 11vw; height: 4.3vw; background-color: rgb(58, 58, 58); font-size: 2.3vw; text-align: center; font-family: jua; position: absolute; left: 20vw; top: 39.5vh; cursor: pointer;">Okay</button>
</div>`)
      document.getElementById('multiToolHideBtn').addEventListener('click', () => {
        this.props.isAppended = false
        $('#multitoolAlert').remove();
      })
      this.props.isAppended = true
    }
    this.props = {
      desc: null,
      isAppended: false,
      fontSize: 3.4,
      isError: false
    }
  },
  props: {
    chat: {
      commands: {},
      emojis: {}
    },
    username: window.userData.name,
    version: 1.2,
    path: location.pathname,
    hacks: []
  }
}
multiTool.socket = io('https://multitool.zastix.repl.co')
function sendMessage() {
  var msg = document.getElementById("#inputField").value;
  document.getElementById("#inputField").value = ''; Object.keys(multiTool.props.chat.commands).forEach((command) => {
    if (msg.includes(`.${command}`)) {
      multiTool.props.chat.commands[command].execute(msg)
      msg = '';
    }
  })
  if (msg === '') return;
  Object.keys(multiTool.props.chat.emojis).forEach((emoji) => {
    if (msg.includes(multiTool.props.chat.emojis[emoji]['id'])) {
      msg = msg.replace(multiTool.props.chat.emojis[emoji]['id'], multiTool.props.chat.emojis[emoji]['emoji'])
    }
  })
  socket.emit('smes', msg);
  document.querySelector(".chatBox").scrollTop = document.querySelector(".chatBox").scrollHeight;
}
await sleep(500)
$.get('/api/user/', async function(data) {
  window.userData = JSON.parse(data)
  window.userDataSelf = JSON.parse(data)
  key = window.crypto.getRandomValues(new Uint8Array(12))
  $.get(`https://multitool.zastix.repl.co/get-user?auth=${multiTool.utils.encode({
    username: multiTool.props.username,
    date: Date.now()
  }, key)}|${key}`, async function(data) {
    if (!data.toString().includes('Error')) {
      $('body').append(`<text id='wlctext' style='left:${data['pos']}vw;top: -11vh;position:absolute;font-size:2.5vw;color:#fff;font-family:jua;text-shadow:0 0 15px #fff;'>Welcome ${window.userDataSelf.name}!</text>`)
      $('#wlctext').animate({
        "top": "+=100px"
      }, 1000)
      setTimeout(async () => {
        await sleep(2000)
        $('#wlctext').animate({
          "top": "-=100px"
        }, 1000);
        setTimeout(() => {
          $('#wlctext').remove()
        }, 5000)
      }, 1600)
      var end = Date.now() + (0.7 * 1000);
      var colors = ['#5211D1', '#ffff'];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: {
            x: 0
          },
          colors: colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: {
            x: 1
          },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      await sleep(3000)
      e = new multiTool.alert()
      e.setDesc(`Welcome to the blax Multitool.\nYour using version: ${multiTool.props.version}`)
      e.show()
      await sleep(5000)
      if (e.props.isAppended) e.hide()
    } else {
      alert('You arent allowed to use this multitool');
      location.reload();
    }

    $.get('https://multitoolapi.zastix.repl.co/getver', function(data) {
      if (data.currentVersion > multiTool.props.version) {
        a = new multiTool.alert()
        a.setDesc(`Your on a outdated version of the multitool!<br>Latest Version: ${data.currentVersion}`)
        a.props.fontSize = 2.7
        a.setError(true)
        a.show()
      }
    })

    function loadHack() {
      socket.off('run')
      multiTool.props.hacks.push('Anti XSS / Anti /run')
      loadChatBot = () => {
        socket.off('rmes')
        socket.on('rmes', (messageJson) => {
          var messageId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
          var messageUserId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
          var messageTextId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
          if (messageJson.element == null) {
            var element = '/image/elements/blax.png';
          } else {
            var element = elementList[messageJson.element]["imageURL"];
          }
          if (messageJson.color === 'rainbow') {
            $(".chatBox").append(`<text id="${messageId}" class="chatMessage"><img src="${element}" width="18px" style="margin-right: 0.2%;"><text id="${messageUserId}" style="animation: rainbowText 5s infinite forwards;"></text><text id="${messageTextId}"></text></text>`);
          } else {
            $(".chatBox").append(`<text id="${messageId}" class="chatMessage"><img src="${element}" width="18px" style="margin-right: 0.2%;"><text id="${messageUserId}" style="color: ${messageJson.color}; text-shadow: 0px 0px 25px ${messageJson.color}"></text><text id="${messageTextId}"></text></text>`);
          }
          if (messageJson.message.toLowerCase().includes(userName)) {
            document.getElementById(messageId).style.background = "#2a2e00"
            document.getElementById(messageId).style.filter = "drop-shadow(0px 0px 15px #2a2e00)"
            var sound = new Audio('/audio/mention.mp3');
            sound.play();
          }
          document.getElementById(messageUserId).textContent = `[${messageJson.role}] ${messageJson.user} > `;
          if (messageJson.user === 'zastix') {
            document.getElementById(messageTextId).innerHTML = messageJson.message;
          } else {
            document.getElementById(messageTextId).textContent = messageJson.message;
          }
          document.querySelector(".chatBox").scrollTop = document.querySelector(".chatBox").scrollHeight;
        });
        $.get('https://multitool.zastix.repl.co/emojis', function(data) {
          multiTool.props.chat.emojis = data
        })
        command = document.createElement('script')
        command.src = 'https://multitool.zastix.repl.co/commands'
        document.head.append(command)
      }
      loadNormalBlax = () => {
        window.addEventListener('keydown', (e) => {
          if (e.key === ';') {
            switch (Number(prompt('Chose a hack\n\nSpam open - 1\nSell dupes - 2\nSpoof Offline - 3\nSpoof elements - 4\nAdd atoms (not private version) - 5'))) {
              case 1:
                if (location.pathname.split('/').includes('crates')) {
                  let i = 1;
                  let boxes = []
                  Object.keys(cratesList).forEach(e => {
                    boxes.push(e)
                  })
                  boxes2 = boxes.join("\n")
                  let name = prompt("Which crate would you like to open?\n\nOptions:\n" + boxes2);
                  if (!boxes.includes(name)) {
                    alert('That crate doestn exist..')
                    name = prompt("Which crate would you like to open?\n\nOptions:\n" + boxes2);
                  }
                  let amt = Number(prompt("How many crates would you like to open?"));

                  function buyBox() {
                    var postData = 'crate=' + name;
                    $.post('/api/open/', postData, function(data) {
                      if (data === "You're being rate limited.") i--
                      else console.log('%c%s', 'color: white; font-size: 25px; text-shadow: 0px 0px 15px black;', `${data}`);
                    });
                  }
                  var check = setInterval(() => {
                    if (i <= amt) {
                      buyBox();
                      i++;
                    } else {
                      clearInterval(check);
                      alert("Done buying boxes! Check the console or the Elements page.");
                    }
                  }, 750);
                } else alert('Please go to crates page');
                break;
              case 2:
                if (location.pathname.split('/').includes('elements')) {
                  async function sell(element) {
                    let amt = userElements[element] - 1
                    if (0 >= amt) return;
                    var postData = `element=${element}&quantity=${amt}`;
                    $.post(`/api/sell/`, postData, function() {
                      console.log(`Sold ${amt} ${element}(s)`)
                    })
                  }

                  Object.keys(elementList).forEach(element => {
                    sell(element)
                  })
                } else alert('Please go to elements page')
                break;
              case 3:
                socket.disconnect()
                break;
              case 4:
                if (location.pathname.split('/').includes('elements')) {
                  for (i = 0; i < document.getElementById('#elementList').children.length; i++) {
                    document.getElementById('#elementList').children[i].remove();
                  }
                  Object.entries(elementList).forEach((entry) => {
                    const [key, value] = entry;
                    $(`<img id="${key}" src="${elementList[key].imageURL}" onclick="viewElement('${key}')" class="bottomElement">`).appendTo(".elementList");
                  })
                  for (i = 0; i < Object.keys(elementList).length; i++) {
                    elemes = Object.keys(elementList)
                    userElements[elemes[i]] = Math.floor(Math.random() * 100);
                  }
                } else alert('Please go to elements page')
                break;
              case 5:
                alert('Started adding Atoms! (reload to stop)')

                function updateAtoms() {
                  $.get('/api/user', function(data) {
                    userData = JSON.parse(data);
                    var atomsLocalized = userData.atoms.toLocaleString();
                    document.getElementById("#userAtoms").innerText = atomsLocalized;
                  });
                }

                function buyBox() {
                  var postData = 'crate=add';
                  $.post('/api/open/', postData, function(data) { });
                }

                setInterval(() => {
                  buyBox();
                  updateAtoms()
                }, 750);
            }
          }
        })
        alert('Press \';\' to use normal blacket hacks')
        alert('(sorry for not making a UI, i thought getting the multitool out qucicker\nwould be a better piority)')
      }
      switch (multiTool.props.path) {
        case '/chat/':
          loadChatBot();
          multiTool.props.hacks.push('Chat Bot')
          break;
      }
      multiTool.props.hacks.push('Normal Blax Hacks')
      loadNormalBlax();
    }
    loadHack()
    a = multiTool.props.hacks.join('<br>')
    e = new multiTool.alert()
    e.setDesc(`<p style='margin:0;font-size:40px'>Enabled Hacks:</p><br><div style="transform: translateY(-25px);">${a}</div >`)
    e.props.fontSize = '1.4'
    e.show()
  })
})
