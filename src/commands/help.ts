import type { Command } from '../command.js';
import { bold, dim } from '../utils/style.js';
import { CLI_VERSION } from '../version.js';

const help: Command = {
  name: 'help',
  description: 'Show help information',
  usage: 'mimo help [command]',
  examples: ['mimo help', 'mimo help chat'],

  async execute(args) {
    if (args.length > 0) {
      console.log(`Run 'mimo ${args[0]} --help' for command help.`);
      return;
    }

    printGlobalHelp();
  },
};

function printGlobalHelp() {
  console.log(`
${bold('mimo')} ${dim('v' + CLI_VERSION)}  Xiaomi MiMo CLI

${bold('Usage:')} mimo <command> [flags]

${bold('Commands:')}
  chat       Text chat with MiMo models
  models     List available models
  auth       Authentication (login, logout, status)
  config     CLI configuration (show, set)
  speech     Speech synthesis (TTS)
  search     Web search
  vision     Image understanding
  quota      Show token usage

${bold('Global Flags:')}
  --api-key <key>      API key
  --base-url <url>      API base URL
  --output <format>     Output format: text, json
  --quiet               Suppress non-essential output
  --verbose             Print HTTP details
  --help                Show help
  --version             Show version

${bold('Getting Help:')}
  Add --help after any command.
  Example: mimo chat --help
`);
}

function printCommandHelp(cmd: Command) {
  console.log(`
${bold(cmd.name)} - ${cmd.description}

${bold('Usage:')} ${cmd.usage}
`);

  if (cmd.options && cmd.options.length > 0) {
    console.log(bold('Options:'));
    for (const opt of cmd.options) {
      console.log(`  ${opt.flag.padEnd(20)} ${opt.description}`);
    }
  }

  if (cmd.examples && cmd.examples.length > 0) {
    console.log(`\n${bold('Examples:')}`);
    for (const example of cmd.examples) {
      console.log(`  ${example}`);
    }
  }
}

export default help;
