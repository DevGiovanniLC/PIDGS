export type Reminder = {
  id: number;
  title: string;
  description: string;
  date: string;
  periodicity?: string; // Ejemplo: 'none', 'daily', 'weekly', 'monthly'
  weekly?: boolean; // Solo si periodicity es 'weekly'
}
