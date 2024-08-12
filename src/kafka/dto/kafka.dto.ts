import { IsNotEmpty } from 'class-validator';

export class ConsumerDto {
  @IsNotEmpty()
  topic: string;
}
export class ProduceTopicDto {
  @IsNotEmpty()
  topic: string;
  @IsNotEmpty()
  message: string;
}
