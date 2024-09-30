import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string | Buffer,
): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hashSync(password, salt);
};

export const compare = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compareSync(password, hash);
};
