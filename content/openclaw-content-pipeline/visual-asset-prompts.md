# Visual Asset Prompts

Created: 2026-05-03 17:12 PDT
Model/provider used: `openai/gpt-image-2`
Output size: `2048x1152`
Format: PNG

These assets are intended to replace the rejected deterministic/process-loop diagrams for the next `content-human-loop` review artifact. They use the project visual system from `../references/visual-design-principles.md`: dark slate background, warm off-white cards, crab/coral accents, muted cyan connectors, modern sans-serif typography, generous spacing, professional editorial tone.

## Asset 1: Making-of timeline

- Final asset: `making-of-timeline-diagram.png`
- Preview asset: `making-of-timeline-diagram-preview.jpg`
- Purpose: show the actual review → feedback → routing → revision history of this post.
- Quality check: text labels rendered cleanly enough for review use; composition is polished and LinkedIn/iPad friendly.

### Prompt

```text
Create a polished LinkedIn-ready editorial technical diagram titled “How This Post Got Better”.

Purpose: show the making-of history of a self-improving content-generation pipeline. It should feel like a premium product/design-system diagram, not clip art and not a Mermaid/SVG box chart.

Visual style: clean editorial technical diagram, dark slate/charcoal background (#111827 / #172033), warm off-white cards (#F7F2E8), crab/coral accents (#F9735B), muted cyan connector lines (#4FB3B8), modern sans-serif typography, generous spacing, subtle paper grain, professional and warm, not cartoonish, not cyberpunk, not glossy SaaS stock art. No logos.

Composition: horizontal 16:9 timeline with six compact milestones. Use cards connected by a coral/cyan thread that loops slightly upward at the end to imply learning. Keep labels very short and legible. Use icon-like mini marks for draft, feedback, routing, revision.

Card labels, keep exact or close and readable:
1. Long Draft
2. LinkedIn Cut
3. First Intro
4. Self‑Improving Hook
5. Marked PDF
6. Recovery Rewrite

For each card, include one tiny secondary line only, if readable:
- Too long → compress
- Use diagram + flow
- First public intro
- Learn taste + style
- Concrete loops
- Goal restored

Add a subtle bottom caption area: “Review → Feedback → Packet Routing → Next Draft”. If exact text is hard, prioritize polished composition and leave caption area clean.

Avoid dense paragraphs, fake UI chrome, obvious generic AI imagery, robots, brains, or chat bubbles. The final image should be suitable for embedding in a LinkedIn post and an iPad-friendly review PDF.
```

## Asset 2: Self-improving content loop

- Final asset: `self-improving-content-loop-diagram.png`
- Preview asset: `self-improving-content-loop-diagram-preview.jpg`
- Purpose: explain the operating system around the model: packet memory, specialist passes, review artifact, Travis feedback, learned routing/taste.
- Quality check: labels rendered cleanly enough for review use; composition is polished and aligned with the established palette.

### Prompt

```text
Create a polished LinkedIn-ready editorial technical diagram titled “Self‑Improving Content Pipeline”.

Purpose: explain the operating system around the model: durable packet memory, specialist passes, review artifacts, Travis feedback, and learned routing/taste that improves future blog and LinkedIn drafts.

Visual style: clean editorial technical diagram, dark slate/charcoal background (#111827 / #172033), warm off-white cards (#F7F2E8), crab/coral accents (#F9735B), muted cyan connector lines (#4FB3B8), modern sans-serif typography, generous spacing, subtle paper texture, professional and warm, not cartoonish, not cyberpunk, not glossy SaaS stock art. No logos.

Composition: circular/loop architecture diagram with five major nodes/cards around a center. Use a premium design-system feel, rounded cards, consistent line weights, subtle depth, and a clear clockwise flow.

Center label: “Packet Memory”
Outer node labels, short and readable:
1. Goals + Preferences
2. Research / Writer / Editor
3. Review Artifact
4. Travis Feedback
5. Learned Routing

Add a small future-output cue at the lower right: “Future posts start closer to the bar”. If text becomes unreliable, use minimal labels and visual hierarchy rather than cramming words.

Avoid robots, brains, magic sparkles, chat-bot bubbles, and dense prose. The image should look like a thoughtful technical/editorial diagram for a professional LinkedIn post, with enough polish to replace the rejected deterministic/process-loop diagrams.
```

## Recommended use in next review artifact

Use `making-of-timeline-diagram.png` as the primary visual because it directly answers Travis's request to show the actual post-making history. Use `self-improving-content-loop-diagram.png` as a secondary/supporting visual only if the review artifact layout can include it without becoming crowded.
