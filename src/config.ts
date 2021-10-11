export interface Config {
  port: number;
}

export const config: Config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};
