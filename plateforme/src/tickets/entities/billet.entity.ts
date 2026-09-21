import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Achat } from './achat.entity.js';

@Entity('billets')
export class Billet {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  dateReservation: Date;

  @Column({ type: 'float' })
  prix: number;

  @Column({ default: 'valide' })
  statut: string;

  @ManyToOne(() => Event, { eager: true, onDelete: 'CASCADE' })
  event: Event;

   @ManyToOne('User', { onDelete: 'CASCADE' })
  user: any;

  @ManyToOne(() => Achat, (achat) => achat.billets, { onDelete: 'CASCADE' })
  achat: Achat;
}