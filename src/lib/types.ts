export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  role: 'member' | 'admin' | 'super_admin';
  updated_at: string;
};

export type VoteType = 'up' | 'down';

export type Vote = {
  vote_type: VoteType;
  user_id: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  tags: string[];
  created_at: string;
  author_id: string;
  profiles: Profile;
  comments: { count: number }[];
  votes: Vote[];
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  body: string;
  parent_id: string | null;
  created_at: string;
  profiles: Profile;
};

export type PostPage = {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
};
