import { errorHandler } from './errors/handler.js';
import { loadConfig } from './config/loader.js';
import { CLI_VERSION } from './version.js';
import { CommandRegistry } from './registry.js';
import type { Command } from './command.js';

import chat from './commands/text/chat.js';
import models from './commands/text/models.js';
import authLogin from './commands/auth/login.js';
import authLogout from './commands/auth/logout.js';
import authStatus from './commands/auth/status.js';
import configShow from './commands/config/show.js';
import configSet from './commands/config/set.js';
import speechSynthesize from './commands/speech/synthesize.js';
import searchQuery from './commands/search/query.js';
import visionDescribe from './commands/vision/describe.js';
import quotaShow from './commands/quota/show.js';
import help from './commands/help.js';

const registry = new CommandRegistry({
  'chat': chat,
  'models': models,
  'auth login': authLogin,
  'auth logout': authLogout,
  'auth status': authStatus,
  'config': configShow,
  'config set': configSet,
  'speech synthesize': speechSynthesize,
  'search query': searchQuery,
  'vision describe': visionDescribe,
  'quota show': quotaShow,
  'help': help,
});

process.stdout.on('error', () => {});
process.stderr.on('error', () => {});

function parseArgs(args: string[]): { commandPath: string[]; extra: string[]; flags: Record<string, string | boolean> } {
  const commandPath: string[] = [];
  const extra: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const flagName = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        flags[flagName] = args[++i];
      } else {
        flags[flagName] = true;
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      const shortFlag = arg.slice(1);
      if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
        flags[shortFlag] = args[++i];
      } else {
        flags[shortFlag] = true;
      }
    } else if (commandPath.length === 0) {
      commandPath.push(arg);
    } else {
      extra.push(arg);
    }
    i++;
  }

  return { commandPath, extra, flags };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    const helpCmd = registry.resolve(['help']);
    if (helpCmd) {
      await helpCmd.command.execute(helpCmd.extra, {});
    }
    return;
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log(`mimo v${CLI_VERSION}`);
    return;
  }

  const { commandPath, extra, flags } = parseArgs(args);

  const resolved = registry.resolve(commandPath);

  if (!resolved) {
    console.error(`Unknown command: ${commandPath.join(' ')}`);
    console.error(`Run 'mimo help' for usage.`);
    process.exit(1);
  }

  try {
    await resolved.command.execute(extra, flags);
  } catch (error) {
    errorHandler(error);
  }
}

main();
