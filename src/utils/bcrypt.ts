import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

export const checkPassword = async (
  hashedPassword: string,
  palinPassword: string
) => bcrypt.compare(palinPassword, hashedPassword);
