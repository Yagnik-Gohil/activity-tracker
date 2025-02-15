import { Entity, Column, ManyToOne, Unique, JoinColumn } from 'typeorm'
import { Task } from './Task'
import { DefaultEntity } from './DefaultEntity'

@Entity()
@Unique(['task', 'date']) // Ensures only one record per task per day
export class Activity extends DefaultEntity {
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task

  @Column({ type: 'integer', default: 0 })
  duration: number // Stores total tracked time (seconds) for the day

  @Column({ type: 'integer', default: 0 })
  idle_duration: number // Stores total idle time (seconds) for the day

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: string // Stores the date when time was tracked
}
