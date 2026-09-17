import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create(
    nom: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      nom,
      email,
      password,
    });

    return this.userRepository.save(user);
  }
}