import type { Command } from '../command.js';
import { loadConfig } from '../../config/loader.js';
import { CLIError } from '../../errors/base.js';

const videoGenerate: Command = {
  name: 'video generate',
  description: 'Generate videos from text or images',
  usage: 'mimo video generate --prompt <text> [--model <model>]',
  examples: [
    'mimo video generate --prompt "A cat playing piano"',
    'mimo video generate -p "Beautiful ocean waves" -m video-01',
  ],
  options: [
    { flag: '--prompt, -p <text>', description: 'Video description' },
    { flag: '--model <model>', description: 'Model (video-01, video-01-live)' },
    { flag: '--duration <seconds>', description: 'Duration (5-15)' },
  ],

  async execute(args, flags) {
    const config = loadConfig();
    const apiKey = (flags['api-key'] as string) || config.apiKey;

    if (!apiKey) {
      throw new CLIError('API key not found. Run "mimo auth login --api-key <key>" first.');
    }

    const prompt = (flags['prompt'] as string) || (flags['p'] as string) || args.join(' ');

    if (!prompt) {
      throw new CLIError('Prompt is required. Usage: mimo video generate --prompt "description"');
    }

    const baseUrl = (flags['base-url'] as string) || config.baseUrl || 'https://api.minimax.chat';
    const model = (flags['model'] as string) || 'video-01';

    console.log(`Generating video (this may take a while)...`);

    const response = await fetch(`${baseUrl}/v1/video_generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        duration: parseInt(flags['duration'] as string) || 5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new CLIError(`API error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    const taskId = data.data?.task_id;

    if (!taskId) {
      throw new CLIError('No task ID in response');
    }

    console.log(`Video task submitted. Task ID: ${taskId}`);
    console.log(`Check status with: mimo video task-get --task-id ${taskId}`);
  },
};

export default videoGenerate;
