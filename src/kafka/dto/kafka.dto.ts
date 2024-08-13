import { IsNotEmpty } from 'class-validator';
import { Message } from 'kafkajs';

export class ConsumerDto {
  @IsNotEmpty()
  topic: string;
}
export class ProduceTopicDto {
  @IsNotEmpty()
  topic: string;
  @IsNotEmpty()
  message: Message;
}
