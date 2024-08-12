import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { VerifyAccountGuard } from 'src/guard/verifyAccount.guard';
import { ConsumerDto, ProduceTopicDto } from './dto/kafka.dto';
@Controller('kafka')
@UseGuards(AuthGuard, VerifyAccountGuard)
export class KafkaController {
  constructor(private kafkaService: KafkaService) {}
  @Post('sendMessage')
  async sendMessage(@Body() body: ProduceTopicDto) {
    const { topic, message } = body;
    await this.kafkaService.produce(topic, message);
    return 'Message sent successfully';
  }
  @Get('consume')
  async consumeMessages(@Query() query: ConsumerDto) {
    const { topic } = query;
    this.kafkaService.consume(topic, (message) => {
      console.log(`Received message: ${message}`);
    });
    return 'Consumer started successfully';
  }
}
