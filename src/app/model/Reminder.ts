export type Reminder = {
  id: number;
  title: string;
  description: string;
  date: Date;
  periodicity?: string; // Ejemplo: 'none', 'daily', 'weekly', 'monthly'
  isCompleted: boolean;
  isArchived: boolean;
}
