import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  // Matches GET /api/events/search?ville=Paris&date=2026-09-30
  @Get('search')
  search(@Query('ville') ville?: string, @Query('date') date?: string) {
    return this.eventsService.search(ville, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
