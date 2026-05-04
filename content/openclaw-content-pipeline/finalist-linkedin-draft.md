# Creating Content Generation Pipelines in OpenClaw

The goal of this project is to create a self-improving content-generation pipeline: one that remembers my preferences, gets better from my feedback, and can regularly produce blog posts and LinkedIn drafts without requiring me to rebuild the context every time.

That last part matters. ChatGPT and Claude can absolutely draft, revise, and brainstorm. The gap is not model capability in a single session. The gap is the operating system around the model: durable project memory, review history, packet artifacts, specialist routing, scheduled cadence, and enough workflow control that the next pass starts from what actually happened instead of from whatever I remember to paste into a chat box.

That is why I’m building this in OpenClaw. I want to explore custom pipelines where files, skills, heartbeats, subagents, and review channels become an inspectable editorial system. Not “ask an AI to write something every Monday.” More like: keep a packet for every article, track status in a board, route work to the right specialist, preserve feedback, and make the next run smarter.

This post is a good example because it has been made by the system it describes.

The actual trail so far:

1. A long-form article draft came out of packet research and editor feedback. My feedback: too long for the target; the review artifact also needed to be better for iPad markup. The packet routed itself toward a LinkedIn-length version.
2. The first LinkedIn compression worked directionally, but I asked for a project-update flow, a diagram instead of dense pipeline bullets, and more consistent visual design.
3. The next version treated it like an ongoing update. I pushed back: this should be a first public introduction, and it should mention that the post itself was produced by the content-generation project.
4. The following version over-indexed on that self-reference. I clarified the stronger hook: the interesting thing is the pipeline learning my taste, style, and quality bar over time.
5. A marked-up PDF asked for a clearer problem, concrete packet/file mechanics, fewer AI-isms, and repeated feedback loops.
6. The next review regressed. It explained the process, but lost the goal. So introspection converted that rejection into this writer brief: start with the goal, explain why plain chat is insufficient, explain why OpenClaw, and show the real making-of history.

Under the hood, each article packet is just a folder: brief, research, drafts, critiques, review PDFs/images, feedback summaries, diagrams, and status. Heartbeats run bounded operator passes: inspect one packet, advance one safe step, update state, stop. Skills act like specialist teammates — researcher, writer, editor, human-review loop, introspector — while I stay in the loop as the taste and direction signal.

The metric is not whether the system can produce text. That is table stakes.

The metric is whether it gets closer to what I would have wanted without me having to re-teach it every time: more specific, less generic, more in my voice, better at choosing what matters, and more honest about weak drafts.

If this works, the pipeline becomes the memory, routing, and taste-preserving process around the model — and future posts should start closer to the bar.