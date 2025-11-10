export interface Post {
  id: number;
  slug: string;
  title: string;
  coverImage?: string;
  content: string;
  tags: string[];
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}
