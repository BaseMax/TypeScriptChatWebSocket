import WebSocket from 'ws';
import readline from 'readline';

const serverUrl = 'ws://localhost:8080';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username: string | undefined;
let currentChannel: string | undefined;

const ws = new WebSocket(serverUrl);

ws.onopen = () => {
  console.log('Connected to server.');

  rl.question('Enter your username: ', (answer) => {
    username = answer;

    if (username) {
      ws.send(
        JSON.stringify({
          event: '/api/login',
          data: {
            username,
          },
        }),
      );
    }
  });
};

ws.onmessage = (event) => {
  const messageString = event.data.toLocaleString();
  const message = JSON.parse(messageString);

  switch (message.event) {
    case 'login':
      console.log(`Logged in as ${message.data.username}`);
      break;
    case 'direct':
      console.log(
        `[Direct Message] From ${message.data.sender}: ${message.data.content}`,
      );
      break;
    case 'group':
      console.log(
        `[Group Message] [${message.data.group}] From ${message.data.sender}: ${message.data.content}`,
      );
      break;
    case 'channel':
      console.log(
        `[Channel Message] [${message.data.channel}] From ${message.data.sender}: ${message.data.content}`,
      );
      break;
    case 'error':
      console.log(`[Error] [${message.data.message}]`);
      break;

    default:
      console.log('Unknown message received:', message);
  }
};

ws.onclose = () => {
  console.log('Disconnected from server.');
  process.exit(0);
};

rl.on('line', (input) => {
  if (input.startsWith('/')) {
    const [command, ...args] = input.slice(1).split(' ');

    switch (command) {
      case 'login':
        if (!username) {
          username = args[0];
          ws.send(JSON.stringify({ event: '/api/login', data: { username } }));
        } else {
          console.log('You are already logged in.');
        }
        break;
      case 'direct':
        if (args.length >= 2) {
          const receiver = args[0] as string;
          const message = args.slice(1).join(' ') as string;
          ws.send(
            JSON.stringify({
              event: '/api/direct',
              data: {
                receiver,
                message,
              },
            }),
          );
        } else {
          console.log('Invalid command. Usage: /direct <username> <message>');
        }
        break;
      case 'group':
        if (args.length >= 2) {
          const group = args[0];
          const content = args.slice(1).join(' ');
          ws.send(
            JSON.stringify({
              event: '/api/group',
              data: {
                group_name: group,
                message: content,
              },
            }),
          );
        } else {
          console.log('Invalid command. Usage: /group <group_name> <message>');
        }
        break;
      case 'join':
        if (args.length === 1) {
          const channel = args[0];
          ws.send(
            JSON.stringify({
              event: '/api/channel/join',
              data: { channel_name: channel },
            }),
          );
          currentChannel = channel;
          console.log(`Joined channel: ${channel}`);
        } else {
          console.log('Invalid command. Usage: /join <channel_name>');
        }
        break;
      case 'leave':
        if (args.length === 1) {
          const channel = args[0];
          ws.send(
            JSON.stringify({
              event: '/api/channel/leave',
              data: { channel_name: channel },
            }),
          );
          currentChannel = undefined;
          console.log(`Left channel: ${channel}`);
        } else {
          console.log('Invalid command. Usage: /leave <channel_name>');
        }
        break;
      default:
        console.log('Unknown command.');
    }
  } else {
    if (!currentChannel) {
      console.log('Please join a channel first using the /join command.');
    } else {
      ws.send(
        JSON.stringify({
          type: 'channel',
          channel: currentChannel,
          content: input,
        }),
      );
    }
  }
});

rl.on('close', () => {
  if (username) {
    ws.send(JSON.stringify({ event: '/api/logout' }));
  }
  ws.close();
});
