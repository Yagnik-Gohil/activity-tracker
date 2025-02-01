import { Entity, Column, OneToMany } from 'typeorm'
import { Task } from './Task'
import { DefaultEntity } from './DefaultEntity'

@Entity()
export class Project extends DefaultEntity {
  @Column('varying character')
  name: string

  @OneToMany(() => Task, (task) => task.project, { cascade: true })
  tasks: Task[]

  @Column({ type: 'integer', default: 0 })
  today_time: number // Stores today's total tracked time in seconds

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  last_updated: string // Stores the last date when time was updated
}
