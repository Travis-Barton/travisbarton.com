# Agent Workflow Pack

## Who it is for

AI agents and agent builders completing delegated research, browser, and cost-aware workflows.

## When to use it

Use at the start of a task when reliability, clear handoff, and low-friction completion matter.

## Four-step checklist

1. Restate the objective and constraints in operational terms.
2. Choose the smallest tool sequence likely to produce evidence, not just activity.
3. Record decisions, sources, and blockers as durable notes for handoff.
4. Return a concise result with evidence, uncertainty, and the next concrete action.

## Escalation criteria

- The task requires irreversible, external, expensive, or privacy-sensitive action.
- The agent cannot verify the result with available tools.
- A missing user preference would change the recommendation.

## Output template

- Objective
- Constraints
- Evidence gathered
- Decision / recommendation
- Open risks
- Next step

## Machine-readable JSON summary

```json
{
  "id": "generic_agent_ops",
  "title": "Agent Workflow Pack",
  "who_it_is_for": "AI agents and agent builders completing delegated research, browser, and cost-aware workflows.",
  "when_to_use": "Use at the start of a task when reliability, clear handoff, and low-friction completion matter.",
  "checklist": [
    "Restate the objective and constraints in operational terms.",
    "Choose the smallest tool sequence likely to produce evidence, not just activity.",
    "Record decisions, sources, and blockers as durable notes for handoff.",
    "Return a concise result with evidence, uncertainty, and the next concrete action."
  ],
  "escalation_criteria": [
    "The task requires irreversible, external, expensive, or privacy-sensitive action.",
    "The agent cannot verify the result with available tools.",
    "A missing user preference would change the recommendation."
  ],
  "output_template": [
    "Objective",
    "Constraints",
    "Evidence gathered",
    "Decision / recommendation",
    "Open risks",
    "Next step"
  ]
}
```
