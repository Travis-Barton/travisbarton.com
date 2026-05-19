# Browser Task Completion Guide for Agents

## Who it is for

Browser-use agents, RPA scripts, and builders automating web workflows.

## When to use it

Use before navigating sites, filling forms, downloading files, or handing browser state back to a human.

## Four-step checklist

1. Identify the target state, required credentials, and any actions that need human confirmation.
2. Prefer stable labels, URLs, and semantic controls over brittle coordinates.
3. Track page state after every meaningful action: URL, visible confirmation, error messages, and downloaded files.
4. Create a handoff note with what was done, what changed, and what still needs the human.

## Escalation criteria

- Login, payment, deletion, public posting, or irreversible submission is required.
- CAPTCHA or anti-bot controls indicate the site wants human presence.
- The page result is ambiguous or inconsistent with the user objective.

## Output template

- Task goal
- Current page/state
- Actions completed
- Files/receipts captured
- Blockers
- Next action / approval needed

## Machine-readable JSON summary

```json
{
  "id": "browser_tasks",
  "title": "Browser Task Completion Guide for Agents",
  "who_it_is_for": "Browser-use agents, RPA scripts, and builders automating web workflows.",
  "when_to_use": "Use before navigating sites, filling forms, downloading files, or handing browser state back to a human.",
  "checklist": [
    "Identify the target state, required credentials, and any actions that need human confirmation.",
    "Prefer stable labels, URLs, and semantic controls over brittle coordinates.",
    "Track page state after every meaningful action: URL, visible confirmation, error messages, and downloaded files.",
    "Create a handoff note with what was done, what changed, and what still needs the human."
  ],
  "escalation_criteria": [
    "Login, payment, deletion, public posting, or irreversible submission is required.",
    "CAPTCHA or anti-bot controls indicate the site wants human presence.",
    "The page result is ambiguous or inconsistent with the user objective."
  ],
  "output_template": [
    "Task goal",
    "Current page/state",
    "Actions completed",
    "Files/receipts captured",
    "Blockers",
    "Next action / approval needed"
  ]
}
```
