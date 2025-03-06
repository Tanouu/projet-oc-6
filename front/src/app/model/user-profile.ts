import { Topic } from "./topic";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  subscriptions: Topic[];
}
