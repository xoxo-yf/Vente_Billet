import { IsInt, Min } from 'class-validator';

export class CreateTicketDto {
  @IsInt({ message: "L'identifiant de l'événement doit être un nombre entier." })
  eventId: number;

  @IsInt({ message: "La quantité doit être un nombre entier." })
  @Min(1, { message: "Vous devez acheter au moins 1 billet." })
  quantite: number;
}
