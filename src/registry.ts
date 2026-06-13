import type { Command } from './command.js';

interface CommandNode {
  command?: Command;
  children: Map<string, CommandNode>;
}

export class CommandRegistry {
  private root: CommandNode = { children: new Map() };

  constructor(commands: Record<string, Command>) {
    for (const [path, cmd] of Object.entries(commands)) {
      this.register(path, cmd);
    }
  }

  private register(path: string, command: Command): void {
    const parts = path.split(' ');
    let node = this.root;
    for (const part of parts) {
      if (!node.children.has(part)) {
        node.children.set(part, { children: new Map() });
      }
      node = node.children.get(part)!;
    }
    node.command = command;
  }

  getAllCommands(): Command[] {
    const commands: Command[] = [];
    const traverse = (node: CommandNode) => {
      if (node.command) commands.push(node.command);
      for (const child of node.children.values()) {
        traverse(child);
      }
    };
    traverse(this.root);
    return commands;
  }

  resolve(commandPath: string[]): { command: Command; extra: string[] } | null {
    let node = this.root;
    const matched: string[] = [];

    for (const part of commandPath) {
      const child = node.children.get(part);
      if (!child) break;
      node = child;
      matched.push(part);

      if (node.command) {
        return { command: node.command, extra: commandPath.slice(matched.length) };
      }
    }

    if (node.command) {
      return { command: node.command, extra: commandPath.slice(matched.length) };
    }

    return null;
  }

  getSuggestions(prefix: string[]): string[] {
    let node = this.root;
    const suggestions: string[] = [];

    for (const part of prefix) {
      const child = node.children.get(part);
      if (!child) return suggestions;
      node = child;
    }

    for (const [name, childNode] of node.children) {
      if (childNode.command) {
        suggestions.push(`  ${name}`);
      } else {
        suggestions.push(`  ${name}`);
      }
    }

    return suggestions;
  }
}
