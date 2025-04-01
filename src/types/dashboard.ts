export interface Dashboard {
  id: string;
  name: string;
  users: User[];
  taskLists: TaskList[];
}
export interface User {
  id: string;
  nickname: string;
  email: string;
  url: string;
  aboutme: string;
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

export interface NotificationState {
  message: string | null;
  type: "success" | "error" | "info" | null;
}

export interface Comment {
  id: string;
  text: string;
  user_id: string;
  note_id: string;
  created_at: string;
  users: {
    id: string;
    nickname: string;
  };
}
