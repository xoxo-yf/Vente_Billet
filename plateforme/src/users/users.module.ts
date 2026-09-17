import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [], // On laisse vide car le contrôleur a été retiré
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
