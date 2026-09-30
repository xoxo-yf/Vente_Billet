import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Billet } from './entities/billet.entity.js';
import { Achat } from './entities/achat.entity.js';
import { Event } from '../events/entities/event.entity.js';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Billet) private readonly billetRepo: Repository<Billet>,
    @InjectRepository(Achat) private readonly achatRepo: Repository<Achat>,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}

  
  async acheterBillets(userId: number, eventId: number, quantite: number, modePaiement?: string): Promise<Achat> {
    const event = await this.eventRepo.findOneBy({ id: eventId });
    if (!event) throw new NotFoundException("L'événement demandé n'existe pas.");

    if (event.placesDisponibles < quantite) {
      throw new BadRequestException(`Places insuffisantes. Il ne reste que ${event.placesDisponibles} places.`);
    }

    // Décrémentation immédiate du stock pour bloquer les places réservées
    event.placesDisponibles -= quantite;
    await this.eventRepo.save(event);

    const montantTotal = event.prix * quantite;
    const nouvelAchat = this.achatRepo.create({
      montantTotal,
      user: { id: userId },
      billets: []
    });
    const achatSauvegarde = await this.achatRepo.save(nouvelAchat);

    const billets: Billet[] = [];
    for (let i = 0; i < quantite; i++) {
      const billet = this.billetRepo.create({
        prix: event.prix,
        event,
        user: { id: userId },
        achat: achatSauvegarde,
        statut: 'en_attente', // Strictement bloqué 'en_attente' au départ !
        modePaiement: modePaiement || 'mobile_money_en_attente' // Stocke la référence (ex: Réf: TXN1234)
      });
      billets.push(billet);
    }
    await this.billetRepo.save(billets);

    achatSauvegarde.billets = billets;
    return achatSauvegarde;
  }

  // Action Admin 1 : Accepter le paiement et valider définitivement les tickets
  async payerReservation(achatId: number, modePaiement: string): Promise<Achat> {
    const achat = await this.achatRepo.findOneBy({ id: achatId });
    if (!achat) throw new NotFoundException("Réservation introuvable.");

    // Passage des billets de cet achat au statut 'paye'
    await this.billetRepo.update(
      { achat: { id: achatId } }, 
      { statut: 'paye', modePaiement: modePaiement } 
    );

    achat.billets = await this.billetRepo.find({
      where: { achat: { id: achatId } }
    });

    console.log(`[Admin] Réservation #${achatId} acceptée et validée.`);
    return achat;
  }

  // Action Admin 2 : Refuser le paiement et libérer automatiquement les places
  async refuserReservation(achatId: number): Promise<Achat> {
    const achat = await this.achatRepo.findOne({
      where: { id: achatId },
      relations: { billets: { event: true } }
    });
    if (!achat) throw new NotFoundException("Réservation introuvable.");

    // Mettre à jour les billets au statut 'refuse'
    await this.billetRepo.update(
      { achat: { id: achatId } },
      { statut: 'refuse' }
    );

    // RÈGLE MÉTIER CRITIQUE : Rendre les places au stock de l'événement
    if (achat.billets && achat.billets.length > 0) {
      const eventId = achat.billets[0].event.id;
      const quantite = achat.billets.length;
      
      const event = await this.eventRepo.findOneBy({ id: eventId });
      if (event) {
        event.placesDisponibles += quantite; 
        await this.eventRepo.save(event);
      }
    }

    achat.billets = await this.billetRepo.find({ where: { achat: { id: achatId } } });
    return achat;
  }

  // Historique de l'utilisateur connecté

  async obtenirHistorique(userId: number): Promise<Billet[]> {
    return this.billetRepo.find({
      where: { user: { id: userId } },
      
      relations: { 
        achat: true, 
        event: true 
      },
      order: { dateReservation: 'DESC' }
    });
  }


  // Outil Admin : Voir toutes les réservations du site
  async obtenirToutesLesReservations(): Promise<Achat[]> {
    return this.achatRepo.find({
      relations: { billets: { event: true } },
      order: { dateAchat: 'DESC' }
    });
  }
}
