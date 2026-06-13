import { writeFileSync } from 'fs';
import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const speechSynthesize: Command = {
  name: 'speech synthesize',
  description: 'Speech synthesis (TTS)',
  usage: 'mimo speech synthesize --text <text> [--out <file>]',
  examples: [
    'mimo speech synthesize --text "Hello world" --out output.mp3',
    'mimo speech synthesize -t "你好世界" -o audio.mp3',
  ],
  options: [
    { flag: '--text, -t <text>', description: 'Text to synthesize' },
    { flag: '--out, -o <file>', description: 'Output file (default: output.mp3)' },
    { flag: '--voice <name>', description: 'Voice name' },
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const text = (flags['text'] as string) || (flags['t'] as string) || args.join(' ');

    if (!text) {
      throw new CLIError('Text is required. Usage: mimo speech synthesize --text "your text"');
    }

    const outFile = (flags['out'] as string) || (flags['o'] as string) || 'output.mp3';
    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.xiaomimimo.com';
    const voice = (flags['voice'] as string) || 'female-qn';

    console.log(`Synthesizing speech...`);

    const response = await fetch(`${baseUrl}/v1/t2a_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(config.timeout * 1000),
      body: JSON.stringify({
        text,
        stream: false,
        voice_setting: {
          voice_id: voice,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    writeFileSync(outFile, Buffer.from(buffer));

    console.log(`Audio saved to: ${outFile}`);
  },
};

export default speechSynthesize;
