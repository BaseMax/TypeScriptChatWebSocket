import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { DirectModule } from './direct/direct.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    EventsModule,
    PrismaModule,
    AuthModule,
    ChannelModule,
    GroupModule,
    UserModule,
    DirectModule,
  ],
})
export class AppModule {}
