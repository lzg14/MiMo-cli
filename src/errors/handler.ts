import { CLIError } from './base.js';
import { ExitCode } from './codes.js';
import { bold, dim } from '../utils/style.js';

export function errorHandler(error: unknown): void {
  if (error instanceof CLIError) {
    console.error(`error: ${error.message}`);
    process.exitCode = error.exitCode;
    return;
  }

  if (error instanceof Error) {
    if (process.env.DEBUG) {
      console.error(dim(error.stack || error.message));
    } else {
      console.error(dim(error.message));
    }
  } else {
    console.error('Unknown error:', error);
  }

  process.exitCode = ExitCode.ERROR;
}
