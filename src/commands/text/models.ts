import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const models: Command = {
  name: 'models',
  description: 'List available MiMo models',
  usage: 'mimo models',

  async execute(_args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.minimax.chat';

    console.log(`
MiMo Models:
═══════════════════════════════════════════════════════
Model                 Context   Description
───────────────────────────────────────────────────────
MiniMax-M2.7          1M        Most capable, best for complex tasks
MiniMax-M2.5          256K      Balanced performance
MiniMax-M2            128K      Cost effective
───────────────────────────────────────────────────────
For more information: https://platform.minimax.chat
`);

    try {
      const response = await fetch(`${baseUrl}/v1/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.models) {
          console.log('\nAPI Models:');
          for (const model of data.models) {
            console.log(`  ${model.id.padEnd(20)} ${model.description || ''}`);
          }
        }
      }
    } catch {
      // Ignore errors, just show static list
    }
  },
};

export default models;
