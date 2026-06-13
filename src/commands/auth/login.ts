import type { Command } from '../command.js';
import { saveConfig } from '../../config/loader.js';
import { bold, dim } from '../../utils/style.js';

const authLogin: Command = {
  name: 'auth login',
  description: 'Login with API key',
  usage: 'mimo auth login --api-key <key>',
  examples: ['mimo auth login --api-key sk-xxxxx'],

  async execute(_args, flags) {
    const apiKey = flags['api-key'] as string | undefined;

    if (!apiKey) {
      console.error('Error: --api-key is required');
      console.log(`
Usage: mimo auth login --api-key <your-api-key>

You can get your API key from: https://platform.minimax.chat
`);
      process.exit(1);
    }

    saveConfig({ apiKey });
    console.log(bold('Successfully logged in!'));
    console.log(dim('API key saved to ~/.mimo/config.json'));
  },
};

export default authLogin;
