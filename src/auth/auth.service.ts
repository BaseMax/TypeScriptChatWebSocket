import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async login(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { username: username },
      include: {
        channels: true,
        groups: true,
        receiverChats: true,
        senderchats: true,
      },
    });

    if (!user) throw new WsException('username not found!');

    return user;
  }
}
