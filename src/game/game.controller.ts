import { Controller, Get } from '@nestjs/common';
import { SimularResponseDTO } from './dto/simular.response.dto';
import { GameService } from './game.service';

@Controller('jogo')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Get('simular')
  runGame(): SimularResponseDTO {
    const ranking = this.service.execute().map((player) => player.descriptor);
    return { vencedor: ranking[0], jogadores: ranking } as SimularResponseDTO;
  }
}
