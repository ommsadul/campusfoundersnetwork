export type IdeaStatus = "COMMITTED" | "EXPLORING" | "OPEN";

export type Timeline =
  | "ALREADY_FULLTIME"
  | "READY_WHEN_RIGHT"
  | "NEXT_YEAR"
  | "NO_PLANS";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  location: string | null;
  university: string | null;
  is_technical: boolean;
  idea_status: IdeaStatus;
  idea_description: string | null;
  timeline: Timeline;
  startup_areas: string[] | null;
  interested_topics: string[] | null;
  accomplishment: string | null;
  education: string | null;
  linkedin_url: string | null;
  profile_completed: boolean;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  bio: string;
  location: string;
  university: string;
  is_technical: boolean;
  idea_status: IdeaStatus;
  idea_description: string;
  timeline: Timeline;
  startup_areas: string[];
  interested_topics: string[];
  accomplishment: string;
  education: string;
  linkedin_url: string;
}

export interface ConnectionInsert {
  sender_id: string;
  receiver_id: string;
  message: string;
  status: "PENDING";
}
