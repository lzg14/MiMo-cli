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

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.xiaomimimo.com';

    console.log(`
MiMo Models:
═══════════════════════════════════════════════════════
Model                 Context   Description
───────────────────────────────────────────────────────
mimo-v2.5-pro         1M        Most capable, best for complex tasks
mimo-v2.5             1M        Fast, low-cost
mimo-v2-pro           256K      High performance
mimo-v2-flash         1M        Fast, low-cost (deprecated)
mimo-v2.5-asr         -         Speech recognition (ASR)
mimo-v2.5-tts         -         Speech synthesis (TTS)
───────────────────────────────────────────────────────
For more information: https://mimo.mi.com/docs
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
