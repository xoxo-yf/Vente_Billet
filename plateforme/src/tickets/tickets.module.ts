import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';
import { Billet } from './entities/billet.entity.js';
import { Achat } from './entities/achat.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    // Déclaration complète des entités pour le gestionnaire de base de données
    TypeOrmModule.forFeature([Billet, Achat, Event, User]),
    JwtModule.register({
      secret: '233842132',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
