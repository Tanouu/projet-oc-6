import { Comment } from './comment';

export interface PostDetails {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  userName: string;
  topicName: string;
  comments: Comment[];
}
