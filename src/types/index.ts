export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  user_type: 'individual' | 'school';
  institution_name?: string;
  institution_type?: string;
  points: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  articles: Article[];
  videos: Video[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  course_id: string;
  reading_time: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  course_id: string;
  duration: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  date: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_articles: string[];
  completed_videos: string[];
  progress_percentage: number;
}