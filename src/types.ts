interface TwitterCursoredResponse {
  next_cursor: number;
  next_cursor_str: string;
  previous_cursor: number;
  previous_cursor_str: string;
}

// GET followers/ids ---------------------------
interface TwitterFollowersIdsBody {
  ids: string[];
}

export type TwitterFollowersIdsResponse = TwitterCursoredResponse & TwitterFollowersIdsBody;

// GET users/lookup ----------------------------
export interface TwitterUser {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  description: string;
  url: string;
  followers_count: number;
  friends_count: number
  listed_count: number;
  created_at: string; // Wed May 23 06:01:13 +0000 2007
  favourites_count: number;
  verified: boolean;
  statuses_count: number;
  default_profile: boolean;
  default_profile_image: boolean;
  profile_banner_url: string;
}

export type TwitterUsersLookupResponse = TwitterUser[];

// Ratings object ----------------------------
export interface BotRating {
  score: number;
  isBot: boolean;
}

export type TwitterUserWithRating = TwitterUser & BotRating;