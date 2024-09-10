import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  page: number = 1; 

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit: number = 10; 
}
