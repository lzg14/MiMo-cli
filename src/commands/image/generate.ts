import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const imageGenerate: Command = {
  name: 'image generate',
  description: 'Generate images from text',
  usage: 'mimo image generate --prompt <text> [--out <file>]',
  examples: [
    'mimo image generate --prompt "A cute cat" --out image.png',
    'mimo image generate -p "Beautiful sunset" -o photo.png',
  ],
  options: [
    { flag: '--prompt, -p <text>', description: 'Image description' },
    { flag: '--out, -o <file>', description: 'Output file' },
    { flag: '--size <size>', description: 'Image size (512x512, 1024x1024)' },
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const prompt = (flags['prompt'] as string) || (flags['p'] as string) || args.join(' ');

    if (!prompt) {
      throw new CLIError('Prompt is required. Usage: mimo image generate --prompt "description"');
    }

    const outFile = (flags['out'] as string) || (flags['o'] as string) || 'output.png';
    const size = (flags['size'] as string) || '1024x1024';
    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.minimax.chat';

    console.log(`Generating image...`);

    const response = await fetch(`${baseUrl}/v1/image_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'image-01',
        prompt,
        image_size: size,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      throw new CLIError('No image URL in response');
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();

    const { writeFileSync } = await import('fs');
    writeFileSync(outFile, Buffer.from(buffer));

    console.log(`Image saved to: ${outFile}`);
  },
};

export default imageGenerate;
