import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const visionDescribe: Command = {
  name: 'vision describe',
  description: 'Describe images (VLM)',
  usage: 'mimo vision describe --image <path> [--prompt <text>]',
  examples: [
    'mimo vision describe --image photo.png --prompt "Describe this image"',
    'mimo vision describe -i image.jpg -p "What is in this picture?"',
  ],
  options: [
    { flag: '--image, -i <path>', description: 'Image file path' },
    { flag: '--prompt, -p <text>', description: 'Question about the image' },
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const imagePath = (flags['image'] as string) || (flags['i'] as string);
    const prompt = (flags['prompt'] as string) || (flags['p'] as string) || args.join(' ') || 'Describe this image';

    if (!imagePath) {
      throw new CLIError('Image path is required. Usage: mimo vision describe --image <path>');
    }

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.minimax.chat';

    const { readFileSync } = await import('fs');
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await fetch(`${baseUrl}/v1/coding_plan/vlm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-VL-01',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: `data:image/jpeg;base64,${base64Image}` },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content || 'No description available';

    console.log(description);
  },
};

export default visionDescribe;
