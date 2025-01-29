import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export class DefaultEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  created_at: string
}
