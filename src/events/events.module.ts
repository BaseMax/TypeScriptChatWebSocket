import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DirectModule } from '../direct/direct.module';
import { GroupModule } from '../group/group.module';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [UserModule, AuthModule, DirectModule, GroupModule, ChannelModule],
  providers: [EventsGateway],
})
export class EventsModule {}
