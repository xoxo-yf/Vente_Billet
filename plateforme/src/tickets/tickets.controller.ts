import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { Request as ExpressRequest } from 'express';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard) // Protège la route par JWT
  @Post('achat')
  @HttpCode(HttpStatus.CREATED)
  acheter(@Body() createTicketDto: CreateTicketDto, @Request() requete: ExpressRequest) {
    // L'ID de l'utilisateur est extrait directement de son jeton JWT décodé
    const userId = (requete.user! as ExpressRequest['user'] & { id: string }).id;
    return (this.ticketsService as any).acheterBillets(userId, createTicketDto);
  }

  @UseGuards(JwtAuthGuard) // Protège l'historique par JWT
  @Get('historique')
  obtenirHistorique(@Request() requete: ExpressRequest) {
    const userId = (requete.user! as ExpressRequest['user'] & { id: string }).id;
    return (this.ticketsService as any).obtenirHistorique(userId);
  }
}
