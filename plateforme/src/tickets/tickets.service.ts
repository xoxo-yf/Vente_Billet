import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Billet } from './entities/billet.entity.js';
import { Achat } from './entities/achat.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';

@Injectable()
export class TicketsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Billet) private billetRepo: Repository<Billet>,
    @InjectRepository(Achat) private achatRepo: Repository<Achat>,
  ) {}

  async acheterBillets(userId: number, dto: CreateTicketDto): Promise<Achat> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Recherche de l'événement avec verrou de sécurité (Pessimistic Write)
      const event = await queryRunner.manager.findOne(Event, {
        where: { id: dto.eventId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!event) throw new NotFoundException("L'événement demandé n'existe pas.");
      
      // Vérification critique du stock disponible
      if (event.placesDisponibles < dto.quantite) {
        throw new BadRequestException(`Places insuffisantes. Il ne reste que ${event.placesDisponibles} places.`);
      }

      // 2. REGLE METIER EXIGEE : Décrémentation du stock
      event.placesDisponibles -= dto.quantite;
      await queryRunner.manager.save(event);

      // 3. Enregistrement de la facture globale d'Achat (Liaison ID sécurisée sans crash)
      const montantTotal = event.prix * dto.quantite;
      const nouvelAchat = queryRunner.manager.create(Achat, {
        montantTotal,
        user: { id: userId }, // Jointure directe simplifiée par ID pour casser la dépendance circulaire
        billets: []
      });
      const achatSauvegarde = await queryRunner.manager.save(nouvelAchat);

      // 4. Génération des billets unitaires
      const billets: Billet[] = [];
      for (let i = 0; i < dto.quantite; i++) {
        const billet = queryRunner.manager.create(Billet, {
          prix: event.prix,
          event,
          user: { id: userId }, // Jointure directe par ID
          achat: achatSauvegarde
        });
        billets.push(billet);
      }
      await queryRunner.manager.save(Billet, billets);

      await queryRunner.commitTransaction();
      achatSauvegarde.billets = billets;
      return achatSauvegarde;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Fonctionnalité clé : Historique des billets par utilisateur
  async obtenirHistorique(userId: number): Promise<Billet[]> {
    return this.billetRepo.find({
      where: { user: { id: userId } },
      order: { dateReservation: 'DESC' }
    });
  }
}
