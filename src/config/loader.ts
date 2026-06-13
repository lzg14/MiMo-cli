import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname } from 'path';
import { mkdirSync } from 'fs';
import { getConfigPath, type Config, DEFAULT_CONFIG } from './schema.js';

let cachedConfig: Config | null = null;

export function loadConfig(): Config {
  if (cachedConfig) return cachedConfig;

  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    cachedConfig = { ...DEFAULT_CONFIG };
    return cachedConfig;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(content);
    cachedConfig = { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    cachedConfig = { ...DEFAULT_CONFIG };
  }

  return cachedConfig;
}

export function saveConfig(config: Partial<Config>): void {
  const configPath = getConfigPath();
  const dir = dirname(configPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const current = loadConfig();
  const merged = { ...current, ...config };

  writeFileSync(configPath, JSON.stringify(merged, null, 2), 'utf-8');
  cachedConfig = merged;
}
