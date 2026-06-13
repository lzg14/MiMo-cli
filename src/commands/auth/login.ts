import type { Command } from '../command.js';
import { saveConfig } from '../../config/loader.js';
import { bold, dim } from '../../utils/style.js';
import { CLIError } from '../../errors/base.js';

const authLogin: Command = {
  name: 'auth login',
  description: 'Login with API key',
  usage: 'mimo auth login --api-key <key>',
  examples: ['mimo auth login --api-key sk-xxxxx'],

  async execute(_args, flags) {
    const apiKey = flags['api-key'] as string | undefined;

    if (!apiKey) {
      throw new CLIError(
        '--api-key is required. Get your key from: https://platform.xiaomimimo.com\n' +
        'Usage: mimo auth login --api-key <your-api-key>'
      );
    }

    saveConfig({ apiKey });
    console.log(bold('Successfully logged in!'));
    console.log(dim('API key saved to ~/.mimo/config.json'));
  },
};

export default authLogin;
