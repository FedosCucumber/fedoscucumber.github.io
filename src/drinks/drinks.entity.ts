import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class drinkDto {
  @ApiProperty({
    description: "Name",
    example: "John doe"
  })
  name: string;

  @ApiProperty({
    description: "Description",
    example: "description"
  })
  description: string;

  @ApiProperty({
    description: "ABV",
    example: 3
  })
  abv: number;

  @ApiProperty({
    description: "IBU",
    example: 1.5
  })
  ibu: number;

  @ApiProperty({
    description: "Image",
    example: "http://"
  })
  imageUrl: string
}

export class RateDrinkDto {
  @ApiProperty({
    description: "drink id",
    example: 1
  })
  drinkId: number;

  @ApiProperty({
    description: "user id",
    example: "d3ff8813b8-b44-4f6-8d01-86a7bv43ec08"
  })
  userId: string;

  @ApiProperty({
    description: "rationg 1-5",
    example: "5"
  })
  rating: number;
}

export class CreateDrinkDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "Name",
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "Description",
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "ABV",
  })
  abv: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "IBU",
  })
  ibu: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "imageUrl",
  })
  imageUrl: string;
}
