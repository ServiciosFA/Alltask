export interface Dashboard {
  id: string;
  name: string;
}
export interface Notestype {
  id: string;
  name: string;
  description: string;
}
export interface TaskList {
  id: string;
  name: string;
  notes: Notestype[];
}
