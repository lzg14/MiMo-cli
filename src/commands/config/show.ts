import type { Command } from '../command.js';
import { bold, dim } from '../../utils/style.js';
import { loadConfig } from '../../config/loader.js';

const configShow: Command = {
  name: 'config',
  description: 'Show CLI configuration',
  usage: 'mimo config',
  examples: ['mimo config'],

  async execute() {
    const config = loadConfig();

    console.log(`
${bold('CLI Configuration:')}
    API Key:  ${config.apiKey ? dim('**********' + config.apiKey.slice(-4)) : dim('not set')}
    Base URL: ${config.baseUrl}
    Model:    ${config.model}
    Output:   ${config.output}
    Timeout:  ${config.timeout}s
`);
  },
};

export default configShow;
