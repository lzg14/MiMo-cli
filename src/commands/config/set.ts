import type { Command } from '../command.js';
import { saveConfig } from '../../config/loader.js';

const configSet: Command = {
  name: 'config set',
  description: 'Set a configuration value',
  usage: 'mimo config set <key> <value>',
  examples: [
    'mimo config set model MiniMax-M2.7',
    'mimo config set timeout 60',
  ],

  async execute(args) {
    if (args.length < 2) {
      console.error('Usage: mimo config set <key> <value>');
      process.exit(1);
    }

    const [key, ...valueParts] = args;
    const value = valueParts.join(' ');

    const validKeys = ['apiKey', 'baseUrl', 'model', 'output', 'timeout', 'quiet', 'verbose'];

    if (!validKeys.includes(key)) {
      console.error(`Invalid key: ${key}`);
      console.error(`Valid keys: ${validKeys.join(', ')}`);
      process.exit(1);
    }

    let parsedValue: string | number | boolean = value;

    if (key === 'timeout') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        console.error('Timeout must be a number');
        process.exit(1);
      }
    }

    if (key === 'quiet' || key === 'verbose') {
      parsedValue = value === 'true' || value === '1';
    }

    saveConfig({ [key]: parsedValue });
    console.log(`Config updated: ${key} = ${value}`);
  },
};

export default configSet;
