import {Entity , PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    titre:string;
 
    @Column({type:'text'})
    description:string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    ville: string;

    @Column()
    nomLieu: string;

    @Column({ type: 'int' })
    placesTotales: number;

    @Column({ type: 'int' })
    placesDisponibles: number;

    @Column({ type: 'float' })
    prix: number;

    @CreateDateColumn()
    createdAt: Date;
}