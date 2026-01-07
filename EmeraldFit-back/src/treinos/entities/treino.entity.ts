import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('treinos')
export class Treino {
  @PrimaryGeneratedColumn()
  id_treino: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  nivel: string;

  @Column({ default: 0 })
  quantidade_exercicios: number;

  @Column()
  icone_mdi: string;
}
