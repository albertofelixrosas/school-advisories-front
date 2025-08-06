export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  username: string;
  role: string;
  name: string;
  last_name: string;
  photo_url: string;
}
