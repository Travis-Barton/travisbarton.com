# Deep Research Workflow for Agents

## Who it is for

Research agents, analyst agents, and humans designing multi-source research workflows.

## When to use it

Use when a final answer needs source quality, claim reconciliation, uncertainty, and citations.

## Four-step checklist

1. Turn the user request into 3–5 research questions and define what would change the answer.
2. Collect sources across at least two independent source types when stakes justify it.
3. Map important claims to evidence, disagreement, and confidence instead of summarizing everything equally.
4. Synthesize into an answer that separates facts, interpretations, unknowns, and recommended next checks.

## Escalation criteria

- Sources are too thin or circular to support the requested confidence.
- The answer touches legal, medical, financial, safety, or high-stakes decisions.
- A paywalled or private source is necessary and the agent lacks access authority.

## Output template

- Research question
- Key sources
- Claims supported
- Claims disputed
- Unknowns
- Recommendation
- Confidence

## Machine-readable JSON summary

```json
{
  "id": "deep_research",
  "title": "Deep Research Workflow for Agents",
  "who_it_is_for": "Research agents, analyst agents, and humans designing multi-source research workflows.",
  "when_to_use": "Use when a final answer needs source quality, claim reconciliation, uncertainty, and citations.",
  "checklist": [
    "Turn the user request into 3\u20135 research questions and define what would change the answer.",
    "Collect sources across at least two independent source types when stakes justify it.",
    "Map important claims to evidence, disagreement, and confidence instead of summarizing everything equally.",
    "Synthesize into an answer that separates facts, interpretations, unknowns, and recommended next checks."
  ],
  "escalation_criteria": [
    "Sources are too thin or circular to support the requested confidence.",
    "The answer touches legal, medical, financial, safety, or high-stakes decisions.",
    "A paywalled or private source is necessary and the agent lacks access authority."
  ],
  "output_template": [
    "Research question",
    "Key sources",
    "Claims supported",
    "Claims disputed",
    "Unknowns",
    "Recommendation",
    "Confidence"
  ]
}
```
