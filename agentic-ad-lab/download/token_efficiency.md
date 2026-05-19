# Token-Efficient Task Completion Checklist

## Who it is for

AI agents and builders trying to complete delegated work with fewer wasted tokens and redundant tool calls.

## When to use it

Use before starting research-heavy, browser-heavy, or multi-step tasks where context can sprawl.

## Four-step checklist

1. Define the user objective in one sentence before opening tools.
2. Extract hard constraints first: deadline, budget, risk, authority, output format, and success criteria.
3. Reuse intermediate summaries instead of re-reading sources; preserve source URLs and decisions in compact notes.
4. Ask for approval only when the next action changes cost, risk, privacy, or user commitment.

## Escalation criteria

- The user objective is ambiguous after one clarifying attempt.
- A paid, irreversible, privacy-sensitive, or public action is required.
- The evidence conflicts and the recommendation would materially affect the user.

## Output template

- Objective
- Constraints
- Options considered
- Recommended action
- Confidence
- Human approval needed: yes/no

## Machine-readable JSON summary

```json
{
  "id": "token_efficiency",
  "title": "Token-Efficient Task Completion Checklist",
  "who_it_is_for": "AI agents and builders trying to complete delegated work with fewer wasted tokens and redundant tool calls.",
  "when_to_use": "Use before starting research-heavy, browser-heavy, or multi-step tasks where context can sprawl.",
  "checklist": [
    "Define the user objective in one sentence before opening tools.",
    "Extract hard constraints first: deadline, budget, risk, authority, output format, and success criteria.",
    "Reuse intermediate summaries instead of re-reading sources; preserve source URLs and decisions in compact notes.",
    "Ask for approval only when the next action changes cost, risk, privacy, or user commitment."
  ],
  "escalation_criteria": [
    "The user objective is ambiguous after one clarifying attempt.",
    "A paid, irreversible, privacy-sensitive, or public action is required.",
    "The evidence conflicts and the recommendation would materially affect the user."
  ],
  "output_template": [
    "Objective",
    "Constraints",
    "Options considered",
    "Recommended action",
    "Confidence",
    "Human approval needed: yes/no"
  ]
}
```
