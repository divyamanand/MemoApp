/** DTO sent from the client when registering */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

/** Portion of `User` the backend returns */
export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  k_vals: Record<"hard" | "medium" | "easy", number>;
  c_vals: Record<"hard" | "medium" | "easy", number>;
  iterations: Record<"hard" | "medium" | "easy", number>;
  createdAt: string;
  updatedAt: string;
}

/** Successful response shape from `registerUser` */
export interface RegisterResponse {
  statusCode: 200;
  message: "User Created Successfully";
  success: true;
  data: UserDTO;
}

/** Error payload emitted by the backend’s `ApiError` class */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  success: false;
  data: null;
  errors?: unknown[];
}
