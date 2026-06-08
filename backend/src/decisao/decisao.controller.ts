import { Controller, Post, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DecisaoService } from './decisao.service';

@Controller('decisao')
export class DecisaoController {
  constructor(private readonly decisaoService: DecisaoService) {}

  @Get('health')
  async health() {
    return this.decisaoService.verificarSaude();
  }

  @Post('analisar')
  async analisar() {
    try {
      return await this.decisaoService.analisar();
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'erro ao executar analise';
      throw new HttpException(mensagem, HttpStatus.BAD_GATEWAY);
    }
  }
}
