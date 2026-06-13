# TransparentVSC

Set your VS Code window transparency on **Windows** and **Linux**.

Maintained fork of [GlassIt-VSC](https://github.com/hikarin522/GlassIt-VSC) by hikarin522, with active bug fixes and maintenance.

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
