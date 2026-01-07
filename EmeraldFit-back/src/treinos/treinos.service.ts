import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { criarTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { Treino } from './entities/treino.entity';

@Injectable()
export class TreinosService {
  constructor(
    @InjectRepository(Treino)
    private treinoRepository: Repository<Treino>,
  ) {}

  async criarTreino(criarTreinoDto: criarTreinoDto) {
    const treino = this.treinoRepository.create(criarTreinoDto);
    return await this.treinoRepository.save(treino);
  }

  async findAll() {
    return await this.treinoRepository.find();
  }

  async findOne(id: number) {
    return await this.treinoRepository.findOne({ where: { id_treino: id } });
  }

  async update(id: number, updateTreinoDto: UpdateTreinoDto) {
    await this.treinoRepository.update({ id_treino: id }, updateTreinoDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.treinoRepository.delete({ id_treino: id });
    return { message: 'Treino deletado com sucesso' };
  }
}
