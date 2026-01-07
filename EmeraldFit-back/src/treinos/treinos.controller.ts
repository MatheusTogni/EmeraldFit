import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { TreinosService } from './treinos.service';
import { criarTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';

@Controller('treinos')
export class TreinosController {
  constructor(private readonly treinosService: TreinosService) {}

  @Post("criar-treino")
  create(@Body() criarTreinoDto: criarTreinoDto) {
    return this.treinosService.criarTreino(criarTreinoDto);
  }

  @Get("buscar-treinos")
  findAll() {
    return this.treinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treinosService.findOne(+id);
  }

  @Put('atualizar/:id')
  update(@Param('id') id: string, @Body() updateTreinoDto: UpdateTreinoDto) {
    return this.treinosService.update(+id, updateTreinoDto);
  }

  @Delete('deletar/:id')
  remove(@Param('id') id: string) {
    return this.treinosService.remove(+id);
  }
}
