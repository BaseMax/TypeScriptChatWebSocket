import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async status(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!user) throw new WsException('username not found!');

    return { status: user.status };
  }

  async onlineUser(username: string) {
    return this.prisma.user.update({
      where: { username },
      data: {
        status: UserStatus.online,
      },
    });
  }

  async offlineUser(username: string) {
    return this.prisma.user.update({
      where: { username },
      data: {
        status: UserStatus.offilne,
      },
    });
  }
}
