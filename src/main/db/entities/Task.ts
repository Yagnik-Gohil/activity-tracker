import { Entity, Column, ManyToOne } from 'typeorm'
import { Project } from './Project'
import { DefaultEntity } from './DefaultEntity'
import { TaskStatus } from '../../utils/enum'

@Entity()
export class Task extends DefaultEntity {
  @Column('varying character')
  name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varying character', default: TaskStatus.TODO })
  status: TaskStatus

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project
}
