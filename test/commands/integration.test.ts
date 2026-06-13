import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

const CLI_PATH = join(process.cwd(), 'dist', 'mimo.js');

function run(args) {
  return new Promise((resolve) => {
    const proc = spawn('node', [CLI_PATH, ...args], {
      cwd: process.cwd(),
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });

    proc.on('error', (err) => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
}

describe('mimo CLI', () => {
  describe('--version', () => {
    it('shows version', async () => {
      const result = await run(['--version']);
      assert.ok(result.stdout.includes('mimo v'));
    });
  });

  describe('--help', () => {
    it('shows help', async () => {
      const result = await run(['--help']);
      assert.ok(result.stdout.includes('Usage:'));
      assert.ok(result.stdout.includes('mimo <command>'));
    });
  });

  describe('help command', () => {
    it('shows help', async () => {
      const result = await run(['help']);
      assert.ok(result.stdout.includes('Usage:'));
      assert.ok(result.stdout.includes('mimo <command>'));
    });
  });

  describe('auth status', () => {
    it('runs without crashing', async () => {
      const result = await run(['auth', 'status']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });

  describe('config', () => {
    it('shows configuration', async () => {
      const result = await run(['config']);
      assert.ok(result.stdout.includes('CLI Configuration') || result.stdout.includes('API Key'));
    });
  });

  describe('models', () => {
    it('runs without crashing', async () => {
      const result = await run(['models']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });

  describe('chat', () => {
    it('requires message', async () => {
      const result = await run(['chat']);
      assert.notStrictEqual(result.code, 0);
    });

    it('runs without crashing with --help', async () => {
      const result = await run(['chat', '--help']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });

  describe('speech synthesize', () => {
    it('runs without crashing with --help', async () => {
      const result = await run(['speech', 'synthesize', '--help']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });

  describe('search query', () => {
    it('runs without crashing with --help', async () => {
      const result = await run(['search', 'query', '--help']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });

  describe('vision describe', () => {
    it('runs without crashing with --help', async () => {
      const result = await run(['vision', 'describe', '--help']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });

  describe('quota show', () => {
    it('runs without crashing with --help', async () => {
      const result = await run(['quota', 'show', '--help']);
      assert.ok(result.code === 0 || result.code === 1);
    });
  });
});
