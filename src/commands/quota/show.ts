import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const quotaShow: Command = {
  name: 'quota show',
  description: 'Show token usage and quota',
  usage: 'mimo quota show',

  async execute(_args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.xiaomimimo.com';

    const response = await fetch(`${baseUrl}/v1/token_plan/remains`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();

    console.log(`
Token Plan Quota:
═══════════════════════════════════════════════════════
`);

    if (data.data) {
      for (const plan of data.data) {
        console.log(`Model:      ${plan.model_name || 'N/A'}`);
        console.log(`Remaining:  ${plan.remaining || 0}`);
        console.log(`Total:      ${plan.total || 0}`);
        console.log(`Reset at:   ${plan.reset_at || 'N/A'}`);
        console.log('───────────────────────────────────────────────────────');
      }
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  },
};

export default quotaShow;
