import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Event } from './entities/event.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepo: Repository<Event>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const nouvelEvenement = this.eventRepo.create({
      ...dto,
      date: new Date(dto.date),
      placesDisponibles: dto.placesTotales,
    });
    return this.eventRepo.save(nouvelEvenement);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepo.find({ order: { date: 'ASC' } });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepo.findOneBy({ id });
    if (!event) throw new NotFoundException('Événement introuvable.');
    return event;
  }

  // Mandatory feature: Search by city and/or date
  async search(ville?: string, date?: string): Promise<Event[]> {
    const query = this.eventRepo.createQueryBuilder('event');

    if (ville) {
      query.andWhere('LOWER(event.ville) LIKE LOWER(:ville)', { ville: `%${ville}%` });
    }

    if (date) {
      // Formats the timestamp to date text (YYYY-MM-DD) for filtering
      query.andWhere('event.date::text LIKE :date', { date: `%${date}%` });
    }

    return query.orderBy('event.date', 'ASC').getMany();
  }

  async remove(id: number): Promise<void> {
    const result = await this.eventRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Événement introuvable.');
  }
}
