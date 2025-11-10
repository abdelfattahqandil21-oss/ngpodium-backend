export interface User {
  id: number;
  username: string;
  nickname?: string;
  email: string;
  image?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
