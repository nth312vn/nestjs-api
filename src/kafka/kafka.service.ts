import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Consumer,
  EachMessagePayload,
  Kafka,
  Message,
  Producer,
} from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
      brokers: this.configService.get<string>('KAFKA_BROKERS').split(','),
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.configService.get<string>('KAFKA_GROUP_ID'),
    });
  }
  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
  }
  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async onModuleInit() {
    await this.connect();
  }
  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
  async produce(topic: string, message: Message) {
    await this.producer.send({
      topic,
      messages: [message],
    });
  }
  async consume(topic: string, callback: (message) => void) {
    await this.consumer.subscribe({
      topic,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        console.log({
          value: message.value.toString(),
          topic: topic.toString(),
          partition: partition.toString(),
        });
        callback(message.value.toString());
      },
    });
  }
}
