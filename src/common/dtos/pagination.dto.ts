import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  /*eso del type hace lo mismo que esto en main.ts en pokedex api
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }, */
}
