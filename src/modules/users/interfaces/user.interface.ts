export interface User {
  userId: number;
  userName: string;
  usernickName?: string;
  userEmail: string;
  userImg?: string;
  userPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}
