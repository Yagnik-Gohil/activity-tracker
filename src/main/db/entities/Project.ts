import { Entity, Column, OneToMany } from 'typeorm'
import { Task } from './Task'
import { DefaultEntity } from './DefaultEntity'

@Entity()
export class Project extends DefaultEntity {
  @Column('varying character')
  name: string

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  tasks: Task[]
}
