export interface OptionDef {
  flag: string;
  description: string;
  required?: boolean;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  options?: OptionDef[];
  examples?: string[];
  execute(args: string[], flags: Record<string, string | boolean>): Promise<void>;
}
