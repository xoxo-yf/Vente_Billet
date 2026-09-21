import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('achat')
  @HttpCode(HttpStatus.CREATED)
  acheter(@Body() body: { eventId: number; quantite: number; userId?: number }) {
    // Si l'interface n'envoie pas d'ID, on utilise l'utilisateur de test numéro 1 par défaut
    const idUtilisateur = body.userId || 1; 
    
    const dto: CreateTicketDto = {
      eventId: Number(body.eventId),
      quantite: Number(body.quantite)
    };
    
    return (this.ticketsService as any).acheterBillets(idUtilisateur, dto);
  }

  @Get('historique')
  obtenirHistorique() {
    const idUtilisateurTemporaire = 1;
    return (this.ticketsService as any).obtenirHistorique(idUtilisateurTemporaire);
  }
}
