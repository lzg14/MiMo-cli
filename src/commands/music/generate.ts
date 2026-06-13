import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const musicGenerate: Command = {
  name: 'music generate',
  description: 'Generate music from text',
  usage: 'mimo music generate --prompt <text> [--out <file>]',
  examples: [
    'mimo music generate --prompt "Upbeat pop song about summer"',
    'mimo music generate -p "Calm piano melody" -o music.mp3',
  ],
  options: [
    { flag: '--prompt, -p <text>', description: 'Music description' },
    { flag: '--out, -o <file>', description: 'Output file' },
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const prompt = (flags['prompt'] as string) || (flags['p'] as string) || args.join(' ');

    if (!prompt) {
      throw new CLIError('Prompt is required. Usage: mimo music generate --prompt "description"');
    }

    const outFile = (flags['out'] as string) || (flags['o'] as string) || 'music.mp3';
    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.minimax.chat';

    console.log(`Generating music...`);

    const response = await fetch(`${baseUrl}/v1/music_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'music-01',
        prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const audioUrl = data.data?.[0]?.audio_url;

    if (!audioUrl) {
      throw new CLIError('No audio URL in response');
    }

    // Download the audio
    const audioResponse = await fetch(audioUrl);
    const buffer = await audioResponse.arrayBuffer();

    const { writeFileSync } = await import('fs');
    writeFileSync(outFile, Buffer.from(buffer));

    console.log(`Music saved to: ${outFile}`);
  },
};

export default musicGenerate;
