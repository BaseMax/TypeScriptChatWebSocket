import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { UserService } from '../user/user.service';
import { UseFilters } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../common/exceptions/allexception.filter';
import { AuthService } from '../auth/auth.service';
import { DirectService } from '../direct/direct.service';
import { GroupService } from '../group/group.service';
import { ChannelService } from '../channel/channel.service';

@WebSocketGateway(8080)
@UseFilters(new WebsocketExceptionsFilter())
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly directService: DirectService,
    private readonly groupService: GroupService,
    private readonly channelService: ChannelService,
  ) {}

  private clients: Map<WebSocket, string> = new Map();
  private clientsId: Map<number, WebSocket> = new Map();

  handleDisconnect(client: any) {
    const username = this.clients.get(client);

    this.clientsId.forEach((value, key) => {
      if (value == client) {
        this.clientsId.delete(key);
      }
    });
    this.userService.offlineUser(username);

    this.clients.delete(client);
    console.log(`user ${username} disconnected!`);
  }

  handleConnection(client: any, ...args: any[]) {}

  @SubscribeMessage('/api/login')
  async login(client: any, data: { username: string }) {
    const user = await this.authService.login(data.username);
    this.clients.set(client, user.username);
    this.clientsId.set(user.id, client);

    await this.userService.offlineUser(user.username);

    return { event: 'login', data: { username: user.username } };
  }

  @SubscribeMessage('/api/user/status')
  getUserStatus(@MessageBody() payload: { username: string }) {
    return this.userService.status(payload.username);
  }

  @SubscribeMessage('/api/group')
  async sendMessageToGroups(
    client: any,
    payload: { group_name: string; message: string },
  ) {
    const username = this.clients.get(client);

    const { newMessage, users } = await this.groupService.sendMessage(
      username,
      payload.group_name,
      payload.message,
    );

    users.forEach((user) => {
      const clientId = user.id;
      const webSocketClient = this.clientsId.get(clientId);

      if (webSocketClient) {
        webSocketClient.send(
          JSON.stringify({
            event: 'group',
            data: {
              group: payload.group_name,
              sender: username,
              content: newMessage.message,
            },
          }),
        );
      }
    });
  }

  @SubscribeMessage('/api/direct')
  async sendPrivateMessage(
    client: any,
    payload: { receiver: string; message: string },
  ) {
    const username = this.clients.get(client);

    const message = await this.directService.sendDirectMessage(
      username,
      payload.receiver,
      payload.message,
    );

    const receiverUser = this.clientsId.get(message.receiverId);
    if (receiverUser) {
      receiverUser.send(
        JSON.stringify({
          event: 'direct',
          data: {
            sender: username,
            content: message.newMessage.message,
          },
        }),
      );
    }

    return {
      event: 'direct',
      data: {
        sender: username,
        content: message.newMessage.message,
      },
    };
  }

  @SubscribeMessage('/api/channel/join')
  async joinPublicChannel(client: any, data: { channel_name: string }) {
    const username = this.clients.get(client);

    await this.channelService.joinPublicChannel(data.channel_name, username);
  }

  @SubscribeMessage('/api/channel/leave')
  async leavePublicChannel(client: any, data: { channel_name: string }) {
    const username = this.clients.get(client);

    await this.channelService.leavePublicChannel(data.channel_name, username);
  }

  @SubscribeMessage('/api/channel/messages')
  getChannelMessages(client: any, data: { channel_name: string }) {
    return this.channelService.getChannelMessages(data.channel_name);
  }

  @SubscribeMessage('/api/user/groups')
  listOfGroups(client: any, data: any) {
    const username = this.clients.get(client);

    return this.groupService.listOfGroups(username);
  }

  @SubscribeMessage('/api/user/direct-messages')
  listOfDirectMessages(client: any, data: any) {
    const username = this.clients.get(client);
    return this.directService.getDirects(username);
  }
}
