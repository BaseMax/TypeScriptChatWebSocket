import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { messageType } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(username: string, groupName: string, message: string) {
    if (!username) throw new WsException('You are not authenticated');

    const group = await this.prisma.group.findFirst({
      where: { name: groupName },
      include: { user: { select: { id: true, username: true } } },
    });

    if (!group) throw new WsException('group not found!');

    const newMessage = await this.prisma.message.create({
      data: {
        type: messageType.Group,
        User: {
          connect: {
            username,
          },
        },
        message,
        Group: {
          connect: { id: group.id },
        },
      },
    });

    return { newMessage, users: group.user };
  }

  listOfGroups(username: string) {
    if (!username) throw new WsException('You are not authenticated');

    return this.prisma.group.findMany({
      include: { user: { select: { username: true } } },
      where: {
        user: {
          some: {
            username,
          },
        },
      },
    });
  }
}
