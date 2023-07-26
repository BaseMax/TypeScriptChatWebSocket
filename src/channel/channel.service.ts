import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { messageType } from '@prisma/client';

@Injectable()
export class ChannelService {
  constructor(private readonly prisma: PrismaService) {}

  getChannelMessages(channelName: string) {
    return this.prisma.message.findMany({
      include: { Channel: { select: { name: true } } },
      where: {
        Channel: {
          name: channelName,
        },
        type: messageType.Channel,
      },
    });
  }

  async joinPublicChannel(channelName: string, username: string) {
    if (!username) throw new WsException('You are not authenticated');

    const channel = await this.prisma.channel.findFirst({
      where: { name: channelName },
    });

    if (!channel) throw new WsException('channel not found!');

    return this.prisma.channel.update({
      where: { id: channel.id },
      data: {
        users: {
          connect: {
            username,
          },
        },
      },
    });
  }

  async leavePublicChannel(channelName: string, username: string) {
    if (!username) throw new WsException('You are not authenticated');
    
    const channel = await this.prisma.channel.findFirst({
      where: { name: channelName },
    });

    if (!channel) throw new WsException('channel not found!');

    await this.checkUserExistsInChannel(channelName, username);

    return this.prisma.channel.update({
      where: { id: channel.id },
      data: {
        users: {
          disconnect: {
            username,
          },
        },
      },
    });
  }

  async checkUserExistsInChannel(
    channelName: string,
    username: string,
  ): Promise<void> {
    const userExists = await this.prisma.channel.findFirst({
      where: {
        name: channelName,
        users: {
          some: { username },
        },
      },
    });

    if (!userExists)
      throw new WsException('You are not a member of the channel');
  }
}
