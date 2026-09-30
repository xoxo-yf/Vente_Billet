import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';


import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { EventsModule } from './events/events.module.js';
import { TicketsModule } from './tickets/tickets.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({     
  imports: [
    // 1. Charger le fichier de configuration en premier
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2.  modules
    AuthModule,
    UsersModule,
    EventsModule,
    TicketsModule,

    // 3. Module d'observation tiers
    ObserveModule.forRoot({
      appKey: process.env.OBSERV_KEY || '',
      appSecret: process.env.OBSERVE_SECRET ||'',
      serviceId: 'plateforme',
    }),

    // 4. Configuration PostgreSQL sécurisée
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
       
        password: 'postgres', 

        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
        
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api/(*.)'], 
    }),
        
    TicketsModule,


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
