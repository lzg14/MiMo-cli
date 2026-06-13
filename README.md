# mimo-cli - Xiaomi MiMo CLI

Command-line tool for Xiaomi MiMo models. Text chat, speech synthesis, image generation, video generation, music generation, web search, and vision understanding.

## Features

- **Chat** - Interactive text chat with MiMo models
- **Speech** - Text-to-speech synthesis (TTS)
- **Image** - Image generation from text
- **Video** - Video generation from text or images
- **Music** - Music generation from text descriptions
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

# Image generation
mimo image generate --prompt "A cute cat" --out image.png

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
| `mimo image generate [options]` | Generate images |
| `mimo video generate [options]` | Generate videos |
| `mimo music generate [options]` | Generate music |
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

### Image Options

| Flag | Description |
|------|-------------|
| `--prompt, -p <text>` | Image description |
| `--out, -o <file>` | Output image file |
| `--size <size>` | Image size (e.g., 1024x1024) |

### Video Options

| Flag | Description |
|------|-------------|
| `--prompt, -p <text>` | Video description |
| `--model <model>` | Model (video-01, video-01-live) |
| `--duration <seconds>` | Duration (5-15) |

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
  "baseUrl": "https://api.minimax.chat",
  "model": "MiniMax-M2.7",
  "output": "text",
  "timeout": 120
}
```

Or use CLI commands:

```bash
mimo config set model MiniMax-M2.7
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
| `MiniMax-M2.7` | 1M | Most capable, best for complex tasks |
| `MiniMax-M2.5` | 256K | Balanced performance |
| `MiniMax-M2` | 128K | Cost effective |

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
