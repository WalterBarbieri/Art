export interface AuthData {
  token: string;
  userTokenResponse: {
    id: string;
    username: string;
    role: string;
  };
}
