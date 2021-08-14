import jwt from "jsonwebtoken";
import { Request } from "express";

export const Authenticate = (
  req: Request<{}, any, any, any, Record<string, any>>,
  res: any,
  next: (arg0?: { status: number; message: any } | undefined) => void
) => {
  const authHeader = req.headers["authorization"]?.replace("Bearer ", "");
  if (authHeader == null) {
    return res.sendStatus(403);
  }
  try {
    const user = jwt.verify(authHeader!, process.env.SECRET!);
    req.user = user;
  } catch (err) {
    if (err) return res.sendStatus(403);
  }
  next();
};
//payload can be userID, email or other user details
export const generateAccessToken = (payload: string | object) => {
  //generating acess token
  const accessToken = jwt.sign(payload, process.env.SECRET!, {
    expiresIn: "1h",
  });
  //generating refresh token
  const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH!, {
    expiresIn: "30 days",
  });
  return {
    accessToken,
    refreshToken,
  };
};

export const verifyRefreshToken = (refreshToken: string) => {
  const user = jwt.verify(refreshToken, process.env.SECRET_REFRESH!);
  return user as any;
};
