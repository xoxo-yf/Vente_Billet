import { IsString, IsNotEmpty, IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Le titre de l’événement est obligatoire.' })
  titre: string;

  @IsString()
  @IsNotEmpty({ message: 'La description de l’événement est obligatoire.' })
  description: string;

  @IsDateString({}, { message: 'Veuillez fournir une date valide (AAAA-MM-JJ).' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: 'La ville est obligatoire.' })
  ville: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom du lieu (ex: Stade, Arena) est obligatoire.' })
  nomLieu: string;

  @IsInt({ message: 'Les places totales doivent être un nombre entier.' })
  @Min(1, { message: 'Il doit y avoir au moins 1 place disponible.' })
  placesTotales: number;

  @IsNumber({}, { message: 'Le prix doit être un nombre valide.' })
  @Min(0, { message: 'Le prix ne peut pas être négatif.' })
  prix: number;
}
