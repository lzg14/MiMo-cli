import { ExitCode } from './codes.js';

export class CLIError extends Error {
  constructor(
    message: string,
    public code: string = 'ERROR',
    public exitCode: number = ExitCode.ERROR
  ) {
    super(message);
    this.name = 'CLIError';
  }
}
