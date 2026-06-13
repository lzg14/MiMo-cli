export interface Config {
  apiKey?: string;
  baseUrl: string;
  model: string;
  output: 'text' | 'json';
  timeout: number;
  quiet: boolean;
  verbose: boolean;
}

export const DEFAULT_CONFIG: Config = {
  baseUrl: 'https://api.xiaomimimo.com',
  model: 'mimo-v2.5-pro',
  output: 'text',
  timeout: 120,
  quiet: false,
  verbose: false,
};

export function getConfigPath(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return `${home}/.mimo/config.json`;
}
