export interface Dashboard {
  id: string;
  name: string;
  users: User[];
  taskLists: TaskList[];
}
export interface User {
  id: string;
  nickname: string;
  mail: string;
  url: string;
}
export interface Notestype {
  id: string;
  description: string;
  assignedUsers: string[];
  comments: Comment[];
  state: 1 | 2;
  created_at: string;
}
export interface TaskList {
  id: string;
  name: string;
  notes: Notestype[];
  priority?: 1 | 2 | 3;
}
export interface Member {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface NotificationState {
  message: string | null;
  type: "success" | "error" | "info" | null;
}
