const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    credentials: true
  }
});
const Database = require("@replit/database")
const db = new Database()
const sio = require('socket.io-client');
const fs = require('fs');
const atob = require('atob')
global.msgs = []
const cron = require('node-cron')

function b64Decode(str) {
  return decodeURIComponent(escape(atob(str)));
}

fs.open('chatlog.json', () => {

  cron.schedule('*/5 * * * *', () => {
    console.log('[DB SAVER] Saved logs to database');
    fs.writeFile('chatlog.json', JSON.stringify(global.msgs), () => { })
  });

  fs.readFile('chatlog.json', function(err, data) {
    json = JSON.parse(data)
    json.forEach(a => {
      global.msgs.push(a)
    })
  })
  const ws = sio.io('https://betastar.org/')

  ws.on('connect', function() {
    console.log("[WS] > Connected")
  });

  ws.on('rmes', (a) => {

    a.time = Date.now()
    global.msgs.push(a)
    console.log(`[WS] > Recieved message, added data | ${Date.now()}`)
  })
})


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('runscript', (a) => {
    io.emit('run', a);
  })

  socket.on('data', (e) => {
    console.log(e)
  })

  socket.on('disconnect', () => {
    console.log('a user disconected')
  })

});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Expose-Headers', '*')
  next();
})
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function() {
    next();
  });
});

function decode(pt, key) {
  pt = pt.split('')
  for (i = 0; i < pt.length; i++) {
    if (key[i]) pt[i] = pt[i].charCodeAt() - key[i]
    else pt[i] = pt[i].charCodeAt() - key[0]
    pt[i] = String.fromCharCode(pt[i])
  }
  return pt.reverse().join('')
}

app.post('/chatlogs', (req, res) => {
  a = atob(req.rawBody).split('|')
  data = JSON.parse(decode(b64Decode(a[0]), a[1].split(',')))
  if ((Date.now() - data.date) > 0.3 * 60 * 1000) {
    res.send('Invalid hash (Erorr)')
  } else {
    res.send(global.msgs)
  }
  //console.log('A user requested chat logs')
})

app.get('/getver', (req, res) => {
  console.log('A user has requested the version')
  res.send({
    "currentVersion": 1.2
  })
});

app.get('/chatlogs/forcesave', (res, req) => {
  fs.open('chatlog.json', () => {
    fs.writeFile('chatlog.json', JSON.stringify(global.msgs), () => {})
    console.log('[DB SAVER] Saved logs to database');
  })
  req.send('forced a save')
})

app.get('/get-user', (req, res) => {
  if (!req.query.auth) {
    res.send('You didnt provide proper authentication (Error)')
    return
  }
  a = atob(req.rawBody).split('|')
  data = JSON.parse(decode(b64Decode(a[0]), a[1].split(',')))
  if ((Date.now() - data.date) > 0.3 * 60 * 1000) {
    res.send('Invalid hash (Erorr)')
  } else {
    db.get('users').then((e) => {
      if (e[data.username]) {
        res.send(e[data.username])
      } else res.send('Acount doesnt exist (Error)')
    })
  }
})

app.get('/commands', (req, res) => {
  res.sendfile('api/res/commands.js')
})

app.get('/xss', (req, res) => {
  res.sendfile('api/res/xss.js')
})

app.get('/emojis', (req, res) => {
  console.log('A user has requested the emojis')
  res.send({
    'skull': {
      id: ':skull:',
      emoji: '💀'
    },
    'eggplant': {
      id: ':eggplant:',
      emoji: '🍆'
    },
    'sob': {
      id: ':sob:',
      emoji: '😭'
    },
    'astonished': {
      id: ':astonished:',
      emoji: '😲'
    }
  })
})

server.listen(80, () => {
  console.log('server started');
});
