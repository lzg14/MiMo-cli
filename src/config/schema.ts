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
  baseUrl: 'https://api.minimax.chat',
  model: 'MiniMax-M2.7',
  output: 'text',
  timeout: 120,
  quiet: false,
  verbose: false,
};

export function getConfigPath(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return `${home}/.mimo/config.json`;
}
