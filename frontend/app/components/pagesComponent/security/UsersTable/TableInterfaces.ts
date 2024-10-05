export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at:string
  }
  
  export interface UserData {
    usersList: User[];
  }
  
  export interface TableProps {
    data?: User[];
  }