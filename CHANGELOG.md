# Changelog

## [0.3.0]
- Forked from GlassIt-VSC 0.2.6 by hikarin522
- Renamed to TransparentVSC
- Fixed: Unicode characters in Windows user profile paths (ä, ö, ü, etc.) caused Add-Type to fail. Paths are now passed to PowerShell as UTF-16LE Base64.
