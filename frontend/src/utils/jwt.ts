import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_id: number; // match backend
  email?: string;
  iat: number;
  exp: number;
}

/*
 Parse the JWT - return an object with numeric `id` (from user_id)
 and optional `email`. 
 */
export function parseJwt(token: string): { id: number; email?: string } {
  const decoded = jwtDecode<JwtPayload>(token);
  return {
    id: decoded.user_id,
    email: decoded.email,
  };
}

//NOTE: I am doing a decode of the JWT to get the user ID and email.
// This is useful for checking if the user is logged in and for displaying user information.
//Since I did not want to touch the backend, I am using the JWT to get the user ID and email.
// I am not going to add a get request to the backend to get the user information right now.
