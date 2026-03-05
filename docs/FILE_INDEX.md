# FILE_INDEX.md

Purpose: fast lookup of important files/configs so we don’t start with broad grep.

## Canonical Config
- OpenClaw workspace guide: `/Users/luisan/.openclaw/workspace/AGENTS.md`
- Teiny persona: `/Users/luisan/.openclaw/workspace/SOUL.md`
- User profile/preferences: `/Users/luisan/.openclaw/workspace/USER.md`
- Long-term memory: `/Users/luisan/.openclaw/workspace/MEMORY.md`
- Local tooling notes: `/Users/luisan/.openclaw/workspace/TOOLS.md`
- Global Claude config: `/Users/luisan/.claude/CLAUDE.md`
- Claude local settings: `/Users/luisan/.claude/settings.json`

## Skills / Workflows
- Tao review skill: `/Users/luisan/.openclaw/workspace/skills/tao-review/SKILL.md`
- Claude review+confidence copy (workspace): `/Users/luisan/.openclaw/workspace/docs/prompts/claude-review-confidence.md`
- Skill catalog root: `/usr/local/lib/node_modules/openclaw/skills/`

## Active Project Roots
- Workspace root: `/Users/luisan/.openclaw/workspace`
- PuenteSAT repo: `/Users/luisan/Trabajo/PuenteSAT/code`
- PuenteSAT Claude commands: `/Users/luisan/Trabajo/PuenteSAT/code/.claude/commands/`

## Logs / Session History (use only after canonical files)
- Claude project sessions: `/Users/luisan/.claude/projects/`
- Claude plans: `/Users/luisan/.claude/plans/`

## Retrieval Order (strict)
1. User-provided path/name
2. This FILE_INDEX.md
3. Canonical config/docs in listed roots
4. Repo-local files
5. Session logs/history
6. Broad grep/find last

## Update Rule
When we create or discover a recurring source-of-truth file, add it here immediately.
