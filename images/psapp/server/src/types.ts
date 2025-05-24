export interface JWTUser {
  email: string;     // Email of the adult who logged in
  selectedUserId?: number;  // ID of the currently selected user account (adult or child)
}