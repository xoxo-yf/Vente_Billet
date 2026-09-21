import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Billet } from './billet.entity.js';

@Entity('achats')
export class Achat {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  dateAchat: Date;

  @Column({ type: 'float' })
  montantTotal: number;

  @ManyToOne('User', { onDelete: 'CASCADE' })
  user: any;

  @OneToMany(() => Billet, (billet) => billet.achat, { cascade: true })
  billets: Billet[];
}