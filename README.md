# TransparentVSC

Set your VS Code window transparency on **Windows** and **Linux**.

Maintained fork of [GlassIt-VSC](https://github.com/hikarin522/GlassIt-VSC) by hikarin522, with active bug fixes and maintenance.

## Installation

**Via VS Code Marketplace** *(coming soon)*
Search for `TransparentVSC` in the Extensions tab (`Ctrl+Shift+X`).

**Via VSIX (manual)**
1. Download the latest `.vsix` file from [Releases](https://github.com/tris09/TransparentVSC/releases)
2. Open VS Code → `Ctrl+Shift+P` → `Extensions: Install from VSIX...`
3. Select the downloaded `.vsix` file
4. Reload VS Code

**Via source**
```bash
git clone https://github.com/tris09/TransparentVSC.git
cd TransparentVSC
npm install -g @vscode/vsce
vsce package
```
Then install the generated `.vsix` as described above.

## Changes vs. GlassIt-VSC

- **Fixed:** Unicode characters in Windows user profile paths (e.g. `ä`, `ö`, `ü`) caused `Add-Type` to fail with a malformed path. Paths are now encoded as UTF-16LE Base64 before being passed to PowerShell. ([Original issue #83](https://github.com/hikarin522/GlassIt-VSC/issues/83))

## Keybindings

| Shortcut | Action |
|---|---|
| `Ctrl+Alt+Z` | Increase transparency |
| `Ctrl+Alt+C` | Decrease transparency |
| `Ctrl+Alt+X` | Minimize transparency (opaque) |

Commands are also available via `Ctrl+Shift+P` → `TransparentVSC: ...`

## Settings

| Setting | Default | Description |
|---|---|---|
| `transparentvsc.alpha` | `220` | Transparency level (1–255) |
| `transparentvsc.step` | `5` | Step per keypress |
| `transparentvsc.force_sway` | `false` | Force swaymsg on Linux/Sway |

## Credits

Based on [GlassIt-VSC](https://github.com/hikarin522/GlassIt-VSC) — Copyright (c) hikarin522, MIT License.
