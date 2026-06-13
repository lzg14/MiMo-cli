import type { Command } from '../command.js';
import { saveConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const configSet: Command = {
  name: 'config set',
  description: 'Set a configuration value',
  usage: 'mimo config set <key> <value>',
  examples: [
    'mimo config set model mimo-v2.5-pro',
    'mimo config set timeout 60',
  ],

  async execute(args) {
    if (args.length < 2) {
      throw new CLIError('Usage: mimo config set <key> <value>');
    }

    const [key, ...valueParts] = args;
    const value = valueParts.join(' ');

    const validKeys = ['apiKey', 'baseUrl', 'model', 'output', 'timeout', 'quiet', 'verbose'];

    if (!validKeys.includes(key)) {
      throw new CLIError(`Invalid key: ${key}. Valid keys: ${validKeys.join(', ')}`);
    }

    let parsedValue: string | number | boolean = value;

    if (key === 'timeout') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        throw new CLIError('Timeout must be a number');
      }
    }

    if (key === 'output' && !['text', 'json'].includes(value)) {
      throw new CLIError('Output must be "text" or "json"');
    }

    if (key === 'quiet' || key === 'verbose') {
      parsedValue = value === 'true' || value === '1';
    }

    saveConfig({ [key]: parsedValue });
    console.log(`Config updated: ${key} = ${value}`);
  },
};

export default configSet;
