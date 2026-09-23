import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('achat')
  @HttpCode(HttpStatus.CREATED)
  acheter(@Body() body: { eventId: number; quantite: number; userId?: number; modePaiement?: string }) {
    // Falls back to user 1 if testing without registration login links
    const idUtilisateur = body.userId || 1;
    return this.ticketsService.acheterBillets(
      Number(idUtilisateur),
      Number(body.eventId),
      Number(body.quantite),
      body.modePaiement
    );
  }

  @Post('payer')
  @HttpCode(HttpStatus.OK)
  payer(@Body() body: { achatId: number; modePaiement: string }) {
    return this.ticketsService.payerReservation(Number(body.achatId), body.modePaiement);
  }

  @Post('refuser')
  @HttpCode(HttpStatus.OK)
  refuser(@Body() body: { achatId: number }) {
    return this.ticketsService.refuserReservation(Number(body.achatId));
  }

  @Get('admin/liste')
  obtenirToutesLesReservations() {
    return this.ticketsService.obtenirToutesLesReservations();
  }

  // CRUCIAL EXAM FEATURE: Strict single-user history filter
  @UseGuards(JwtAuthGuard) // Re-activates protection guard checkpoint
  @Get('historique')
  obtenirHistorique(@Request() requete: { user: { id: number } }) {
    // Read user information payload directly from the active decrypted security token session
    const userId = requete.user.id; 
    return this.ticketsService.obtenirHistorique(userId);
  }
}
