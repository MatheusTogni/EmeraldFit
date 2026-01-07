import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Treino } from '../../treinos/entities/treino.entity';

@Entity('exercicios_treino')
export class ExercicioTreino {
  @PrimaryGeneratedColumn()
  id_exercicio_treino: number;

  @Column()
  id_treino: number;

  @Column({ type: 'varchar', length: 255 })
  nome_exercicio: string;

  @Column({ type: 'varchar', length: 100 })
  series: string;

  @Column({ type: 'varchar', length: 100 })
  repeticoes: string;

  @ManyToOne(() => Treino)
  @JoinColumn({ name: 'id_treino' })
  treino: Treino;
}
