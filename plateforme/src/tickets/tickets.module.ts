import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';
import { Billet } from './entities/billet.entity.js';
import { Achat } from './entities/achat.entity.js';
import { AuthModule } from '../auth/auth.module.js'; // Nécessaire pour faire fonctionner le JwtAuthGuard
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Billet, Achat,Event,User]),

    JwtModule.register({
      secret:'233842132',
      signOptions:{expiresIn:'1d'},
    }),
    
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
