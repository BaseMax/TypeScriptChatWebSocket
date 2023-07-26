import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { messageType } from '@prisma/client';

@Injectable()
export class DirectService {
  constructor(private readonly prisma: PrismaService) {}

  async sendDirectMessage(sender: string, receiver: string, message: string) {
    if (!sender) throw new WsException('You are not authenticated');

    let chat: any;
    const receiverExits = await this.prisma.user.findFirst({
      where: { username: receiver },
    });

    if (!receiverExits) throw new WsException('username not found!');

    chat = await this.prisma.chat.findFirst({
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
      where: {
        AND: [
          {
            sender: { username: sender },
          },
          {
            receiver: { username: receiver },
          },
        ],
      },
    });

    if (!chat) {
      chat = await this.prisma.chat.create({
        data: {
          sender: {
            connect: { username: sender },
          },
          receiver: {
            connect: { username: receiver },
          },
        },
      });
    }

    const newMessage = await this.prisma.message.create({
      data: {
        type: messageType.Chat,
        message,
        User: {
          connect: {
            username: sender,
          },
        },
        Chat: {
          connect: { id: chat?.id },
        },
      },
      include: { Chat: true },
    });

    return { newMessage, receiverId: receiverExits.id };
  }

  async getDirects(username: string) {
    if (!username) throw new WsException('You are not authenticated');

    const user = await this.prisma.user.findFirst({ where: { username } });

    if (!user) throw new WsException('username not found!');

    return this.prisma.chat.findMany({
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
        messages: true,
      },
      where: {
        OR: [
          {
            sender: {
              username,
            },
          },
          {
            receiver: {
              username,
            },
          },
        ],
      },
    });
  }
}
