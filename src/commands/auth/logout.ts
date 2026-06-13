import type { Command } from '../command.js';
import { saveConfig } from '../../config/loader.js';
import { bold, dim } from '../../utils/style.js';

const authLogout: Command = {
  name: 'auth logout',
  description: 'Logout and remove credentials',
  usage: 'mimo auth logout',

  async execute() {
    saveConfig({ apiKey: undefined });
    console.log(bold('Logged out successfully.'));
    console.log(dim('Credentials removed from ~/.mimo/config.json'));
  },
};

export default authLogout;
