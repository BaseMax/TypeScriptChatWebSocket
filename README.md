# TypeScript WebSocket Project

This is a real-time chat application built with TypeScript and WebSocket, allowing users to communicate through direct messages, group messages, and channels. The application offers bidirectional communication between clients and the server, providing a seamless chat experience.

## Features

- **User-to-User Direct Messaging:** Users can send direct messages to each other privately.
- **Group Messaging:** Users can participate in group conversations with multiple participants.
- **Channels:** Users can join and send messages to public channels.

## Prerequisites

Before running this project, ensure you have the following prerequisites installed on your system:

- Node.js (>=14.x)
- npm (Node Package Manager)

## Getting Started

Clone this repository to your local machine:

```bash
git clone https://github.com/BaseMax/TypeScriptWebSocket
cd TypeScriptWebSocket
```

Install project dependencies:
```bash
npm install
```

## Usage

### Starting the WebSocket Server

To start the WebSocket server, run the following command:

```bash
npm run start:server
```

This will launch the server and bind it to a specified port (default is 8080). The server will be ready to accept WebSocket connections from clients.

### Starting the WebSocket Client

To start the WebSocket client, run the following command:

```bash
npm run start:client
```

The client will attempt to connect to the WebSocket server running on the specified host and port. You can adjust the server host and port in the `src/client.ts` file.

## Chat Commands

Once the WebSocket client is running, you can use the following commands:

- `/login <username>`: Log in with your desired username to join the chat.
- `/direct <username> <message>`: Send a direct message to another user using their username.
- `/group <group_name> <message>`: Send a message to a specific group of users.
- `/join <channel_name>`: Join a public chat channel to send and receive messages.
- `/leave <channel_name>`: Leave a public chat channel.

### Handling WebSocket Events

Both the WebSocket server and client have event handlers for the following events:

- `open`: Triggered when the WebSocket connection is successfully established.
- `message`: Triggered when a message is received from the other party.
- `close`: Triggered when the WebSocket connection is closed.

You can customize the behavior of these event handlers in the respective src/server.ts and src/client.ts files.

## Configuration

You can modify the WebSocket server settings in the src/server.ts file:

- `PORT`: The port on which the WebSocket server will listen for incoming connections.

You can adjust the WebSocket client settings in the src/client.ts file:

- `SERVER_HOST`: The hostname or IP address of the WebSocket server.
- `SERVER_PORT`: The port on which the WebSocket server is running.

## Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GPL-3.0 License.

Copyright 2023, Max Base
