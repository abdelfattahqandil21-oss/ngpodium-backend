export interface Post {
  postId: number;
  postSlug: string;
  postTitle: string;
  postCoveredImg?: string;
  postContent: string;
  postTags: string[];
  createdAt: Date;
  modifiedAt: Date;
}
