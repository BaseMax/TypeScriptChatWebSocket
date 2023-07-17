# TypeScript WebSocket Project

This is a TypeScript WebSocket project that demonstrates how to create a WebSocket server and client using TypeScript. WebSocket enables bidirectional communication between the server and clients, making it ideal for real-time applications.

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

The client will attempt to connect to the WebSocket server running on the specified host and port. You can adjust the server host and port in the src/client.ts file.

### Handling WebSocket Events

Both the WebSocket server and client have event handlers for the following events:

- open: Triggered when the WebSocket connection is successfully established.
- message: Triggered when a message is received from the other party.
- close: Triggered when the WebSocket connection is closed.

You can customize the behavior of these event handlers in the respective src/server.ts and src/client.ts files.

## Configuration

You can modify the WebSocket server settings in the src/server.ts file:

- PORT: The port on which the WebSocket server will listen for incoming connections.

You can adjust the WebSocket client settings in the src/client.ts file:

- SERVER_HOST: The hostname or IP address of the WebSocket server.
- SERVER_PORT: The port on which the WebSocket server is running.

## Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GPL-3.0 License.

Copyright 2023, Max Base
