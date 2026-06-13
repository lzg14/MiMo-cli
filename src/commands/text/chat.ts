import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const chat: Command = {
  name: 'chat',
  description: 'Chat with MiMo models',
  usage: 'mimo chat [options] [message]',
  examples: [
    'mimo chat "Hello, who are you?"',
    'mimo chat --model mimo-v2.5-pro "Explain quantum computing"',
    'mimo chat --no-stream',
  ],
  options: [
    { flag: '--model <model>', description: 'Model to use' },
    { flag: '--system <text>', description: 'System prompt' },
    { flag: '--stream', description: 'Enable streaming (default)' },
    { flag: '--no-stream', description: 'Disable streaming' },
    { flag: '--json', description: 'Output as JSON' },
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const message = args.join(' ') || flags['message'] as string || '';

    if (!message) {
      throw new CLIError('Message is required. Usage: mimo chat "your message"');
    }

    const model = (flags['model'] as string) || config.model || 'mimo-v2.5-pro';
    const systemPrompt = (flags['system'] as string) || undefined;
    const stream = flags['stream'] !== false && flags['no-stream'] !== true;
    const outputJson = flags['json'] === true;

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.xiaomimimo.com';

    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: message });

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    if (stream) {
      const reader = response.body?.getReader();
      if (!reader) throw new CLIError('No response body');

      process.stdout.write('\n');
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        process.stdout.write(chunk);
      }

      process.stdout.write('\n');

      if (outputJson) {
        console.log(JSON.stringify({ response: fullContent, model, usage: {} }));
      }
    } else {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      if (outputJson) {
        console.log(JSON.stringify({ response: content, model, usage: data.usage }));
      } else {
        console.log(content);
      }
    }
  },
};

export default chat;
