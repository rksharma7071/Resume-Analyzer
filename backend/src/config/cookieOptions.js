const isProduction = process.env.NODE_ENV === "production";

export const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const cookieOptions = {
  ...clearCookieOptions,
  maxAge: 24 * 60 * 60 * 1000, // 1 day, same as the JWT
};