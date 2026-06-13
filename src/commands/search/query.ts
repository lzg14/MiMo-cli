import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const searchQuery: Command = {
  name: 'search query',
  description: 'Web search',
  usage: 'mimo search query <query>',
  examples: [
    'mimo search query "latest news about AI"',
    'mimo search "weather in Beijing"',
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const query = args.join(' ');

    if (!query) {
      throw new CLIError('Query is required. Usage: mimo search query "your question"');
    }

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.xiaomimimo.com';

    const response = await fetch(`${baseUrl}/v1/coding_plan/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(config.timeout * 1000),
      body: JSON.stringify({
        top_k: 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const results = data.data?.results || [];

    if (results.length === 0) {
      console.log('No results found.');
      return;
    }

    console.log(`\nSearch Results for: "${query}"\n`);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log(`${i + 1}. ${result.title || 'No title'}`);
      if (result.url) console.log(`   ${result.url}`);
      if (result.snippet) console.log(`   ${result.snippet.substring(0, 200)}...`);
      console.log();
    }
  },
};

export default searchQuery;
