import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { bold, dim, green } from '../../utils/style.js';

const authStatus: Command = {
  name: 'auth status',
  description: 'Check authentication status',
  usage: 'mimo auth status',

  async execute() {
    const config = loadConfig();

    if (config.apiKey) {
      console.log(`
${bold('Authentication Status:')} ${green('Logged in')}
${dim('API Key:')} ${'*'.repeat(20)}${config.apiKey.slice(-4)}
`);
    } else {
      console.log(`
${bold('Authentication Status:')} ${dim('Not logged in')}
${dim('Run:')} mimo auth login --api-key <your-key>
`);
    }
  },
};

export default authStatus;
