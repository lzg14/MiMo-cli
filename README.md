# mimo-cli - Xiaomi MiMo CLI

Command-line tool for Xiaomi MiMo models. Text chat, speech synthesis, web search, and vision understanding.

## Features

- **Chat** - Interactive text chat with MiMo models
- **Speech** - Text-to-speech synthesis (TTS)
- **Search** - Web search powered by MiMo
- **Vision** - Image understanding with VLM
- **Quota** - View token usage and quota

## Requirements

- Node.js >= 18
- MiMo API key

## Installation

### npm

```bash
npm install -g @lzg14/mimo-cli
```

### Build from source

```bash
git clone https://github.com/lzg14/MiMo-cli.git
cd MiMo-cli
npm install
npm run build
npm link
```

## Quick Start

```bash
# Login with API key
mimo auth login --api-key sk-xxxxx

# Text chat
mimo chat "Hello, who are you?"

# Speech synthesis
mimo speech synthesize --text "Hello world" --out output.mp3

# Web search
mimo search query "latest news about AI"

# Image understanding
mimo vision describe --image photo.png --prompt "Describe this image"

# Check quota
mimo quota show
```

## Commands

| Command | Description |
|---------|-------------|
| `mimo chat [options] [message]` | Chat with MiMo models |
| `mimo models` | List available models |
| `mimo auth login --api-key <key>` | Login with API key |
| `mimo auth logout` | Logout and remove credentials |
| `mimo auth status` | Check authentication status |
| `mimo config` | Show configuration |
| `mimo config set <key> <value>` | Set a configuration value |
| `mimo speech synthesize [options]` | Text-to-speech synthesis |
| `mimo search query <query>` | Web search |
| `mimo vision describe [options]` | Image understanding |
| `mimo quota show` | Show token usage |

## Options

### Global Flags

| Flag | Description |
|------|-------------|
| `--api-key <key>` | MiMo API key |
| `--base-url <url>` | API base URL |
| `--output <format>` | Output format: text, json |
| `--quiet` | Suppress non-essential output |
| `--verbose` | Print HTTP details |
| `--help` | Show help |
| `--version` | Show version |

### Chat Options

| Flag | Description |
|------|-------------|
| `--model <model>` | Model to use |
| `--system <text>` | System prompt |
| `--stream` | Enable streaming (default) |
| `--no-stream` | Disable streaming |
| `--json` | Output as JSON |

### Speech Options

| Flag | Description |
|------|-------------|
| `--text, -t <text>` | Text to synthesize |
| `--out, -o <file>` | Output audio file |
| `--voice <name>` | Voice name |

### Vision Options

| Flag | Description |
|------|-------------|
| `--image, -i <path>` | Image file path |
| `--prompt, -p <text>` | Question about the image |

## Configuration

Config file: `~/.mimo/config.json`

```json
{
  "apiKey": "sk-xxxxx",
  "baseUrl": "https://api.xiaomimimo.com",
  "model": "mimo-v2.5-pro",
  "output": "text",
  "timeout": 120
}
```

Or use CLI commands:

```bash
mimo config set model mimo-v2.5-pro
mimo config
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MIMO_API_KEY` | API key |
| `HTTPS_PROXY` | HTTPS proxy URL |
| `HTTP_PROXY` | HTTP proxy URL |

## Models

| Model | Context | Description |
|-------|---------|-------------|
| `mimo-v2.5-pro` | 1M | Most capable, best for complex tasks |
| `mimo-v2.5` | 1M | Fast, low-cost |
| `mimo-v2-pro` | 256K | High performance |
| `mimo-v2-flash` | 1M | Fast, low-cost (deprecated, will auto-migrate to V2.5) |

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Type check
npm run typecheck
```

## License

MIT
