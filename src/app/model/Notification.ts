export interface Notification {
    id?: number;
    title: string;
    body: string;
    // ISO format (yyyy-MM-ddTHH:mm)
    scheduleTime: string;
  }
  