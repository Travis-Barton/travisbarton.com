---
title: Claude Code as Infrastructure
slug: friction-removal-agent-platforms
date: March 2026
description: The same customer feedback workflow built two ways, in Python and in Claude Code, to show where the real engineering tax in applied ML actually lives.
og_description: Most applied ML systems spend more time on parsing, auth, and operational glue than on the model. This essay shows what changes when the same workflow is built in Python versus Claude Code.
tags:
  - Applied ML
  - Interfaces
  - Claude Code
  - Trade-offs
---

# Claude Code as Infrastructure

Most applied ML system engineers spend more time on parsing, auth, pagination, and plumbing than on the actual model itself. Claude Code offers a _new_ kind of infrastruture that solves much of these problems. To see how, lets look at a customer feedback workflow built two ways: once in Python, and once as a Claude Code pipeline.

## TL;DR

- Claude Code pipelines are strongest when the inputs are messy, the output is language or code, and speed of building matters more than 100% determinism.
- All Claude Code pipelines can also be built in Python, but you pay for it in maintenance, input limitations, inflexibility, and all the glue nobody shows in the demo.
- The trade-off is real: higher run-time cost, slower execution, weaker guarantees, and a much larger security surface if you do not sandbox the agent carefully.

> **A note on naming:** I'm using "Claude Code" the way people use "Kleenex": as a familiar brand name for a broader category. The more precise label would be something like "code-facing agent runtime," but Claude Code is the name most people recognize. Tools in the same family include Codex, OpenCode, Gemini CLI, Droid, Amp, and Antigravity.

## The problem: messy inputs

Let's take the example of a *customer feedback classifier*.

Every week, someone drops you an export of customer feedback. Sometimes it's a file. Sometimes it's the select-all, copy, paste blob from a text box. Tabs, uneven columns, multiline cells, random whitespace.

Then things get worse. The "feedback" also contains HTML dumps from a web form, Slack threads pasted inline, Jira tickets used as labels or ground truth, and screenshots of JSON from a dashboard because that was the fastest way to share it.

In most applied ML work, the model is the easy part. The hard part is the translation layer between reality and the model. (Who in their right mind would support pictures of JSON in their PRD??)

## Code pipelines make you specify every input source

Python can tame this kind of chaos, but only if you're willing to own every adapter yourself. You have to build and maintain a parser for every input format, and if someone pastes something slightly wrong, the pipeline fails. Sometimes gracefully, sometimes not. Either way, the output is wrong or missing.

> **Technical:** eg lets start with pasted spreadsheet text. Python's standard library includes `csv.Sniffer` specifically because CSV "dialects" vary and you often have to deduce the delimiter from a sample. It even has a `has_header` heuristic to guess whether the first row looks like column names. pandas helps, but even its docs note that if `sep=None`, the fast C engine cannot automatically detect the separator, so it falls back to the Python engine and relies on `csv.Sniffer`.

Even the toy version starts like this:

```python
import io, csv
import pandas as pd

REQUIRED = {"comment"}

def ingest_excel_paste(text: str) -> pd.DataFrame:
    try:
        sep = csv.Sniffer().sniff(text[:5000]).delimiter
    except Exception:
        sep = "\t"  # common "Excel paste" guess

    df = pd.read_csv(io.StringIO(text), sep=sep, engine="python")
    df.columns = [c.strip().lower() for c in df.columns]

    missing = REQUIRED - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")

    return df
```

Then you add HTML extraction with `BeautifulSoup`, Slack OAuth plus cursor-based pagination and rate limits, Jira auth with `startAt`/`maxResults` pagination, OCR with Tesseract, and finally the operational work of deployment, monitoring, and maintenance. The end result, is that you need a whole eng dedicated _just_ to the maintanaince and feature requests of the input, let alone the MLE for the model! 

"Well Travis," you might say, "Why not add a LLM pipeline in *between my user and my python?*" and thats a great solution! However, the problem still remains. In the end you have to venture _into_ determinism for that pipeline to function, and sometimes (like when new feilds in data appear) there just _isn't_ compatability between your **data** and your **pipeline**. 

Claude Code infra doesnt have this problem, because it's pipeline can _mold to the shape of your data._

// note for cursor: can we make this a color block like we did the "technocal part"?

Note: In a Claude Code pipeline, connectors still have to be built, but more of the work gets absorbed by the runtime, existing tools, and the model's ability to reason through bad inputs. You are trading handwritten adapters for a system that can often recover on its own and/or make its own tooling. For example, if a python tool that a Claude Code uses fails, it can edit that file, and then run it again. It works _around_ failures instead of getting blocked by them.

## What Claude Code changes

Claude Code is a code-facing agent runtime. It can read files, execute commands, call tools and APIs, and iterate on its own work. It happens to be used for code generation, but the same pattern works anywhere the inputs are messy and the steps are not fully predictable.

The coolest part (imo) is what counts as acceptable input. In a Python pipeline, you define a schema and reject anything that does not match that pattern. In a Claude Code pipeline, you start with the messy thing you actually have: a spreadsheet paste, an HTML dump, a screenshot, broken CSV, malformed JSON, voice recordings, or all the above combined! The model can _infer_ structure instead of making you write a parser for every variation.

Once you embrace that, input stops being the bottleneck, and a world of user inputs become available to you. Users just need to paste what they have and the system can usually work with it. No ingestion UI, no client library, no "please clean this up before I can use it." You can truely meet users where they're at.

Claude Code also runs in a loop: gather context, act, verify, repeat. It can branch, recover, and retry without you spelling out every edge case in advance. Subagents make that modular: ingestion, classification, and reporting can each run as separate specialists with separate context and permissions.

## Smaller codebases 
When you build on Claude Code, what you're actually writting are high level instructions in the form of markdown files. Here's what the customer feedback classifier might like as a Claude Code skill instead of a Python pipeline:

```yaml
---
name: classify-feedback
description: Classify messy customer feedback pasted from Excel, HTML, or threads; output tags and a weekly memo.
---

Inputs may be:
- Raw pasted spreadsheet text (Excel or Google Sheets)
- HTML dumps
- Slack and Jira excerpts pasted as text
- Screenshot of JSON (image attachment)

Guardrails:
- Do not search for labels, answer keys, or ground truth
  unless the user provided them in this session.
- If training labels are required, ask for a labeled subset.

Outputs:
- Table: id, category, sentiment, confidence, rationale
- Weekly memo: top themes, top pain points, notable outliers

Failure handling:
- If parsing is ambiguous, ask one clarifying question
  and propose a best-guess interpretation.
```

Now compare that with the Python side. If you want to see what handling messy inputs looks like at production scale, look at LangChain's [document loaders directory](https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain_classic/document_loaders): well over a hundred Python modules dedicated to specific input sources. Across that directory, you see source-specific auth, pagination, error handling, and format quirks repeated over and over. The Claude Code skill above is 20 lines of plain English.

*The complexity does not vanish. It gets pushed down into the runtime, existing CLI tools, MCP connectors, or the rest of your company's infrastructure. The work still happens. You just are not the one hand-writing and maintaining each adapter. And often you can rely on plugins that LLMs can easily understand/setup, eg: [google's workspace cli](https://github.com/googleworkspace/cli)*.

## Why Claude Code as a platform now?

The reason that Claude Code starts to feel like a platform and previous LLM applications did not, is that it can own the full loop. Inspect the world, call tools, edit code, recover from failure, and keep going. Not perfectly, and not with the same guarantees as traditional code-infrastructure, but with much less hand-built glue.

> **A personal example:** I once sent a voice note into one of my agent workflows, and there was no transcription tool installed. The agent noticed the missing dependency, found one, installed it, transcribed the message, and drafted a reply. Nobody had designed that feature. The system just worked backward from the outcome and filled in the missing piece.

Traditional infra is still better at scheduling, monitoring, and hard guarantees. What changes is the human interface, the ease of creation, and the ability to self-heal. Inputs get looser, iteration gets faster, and far less of the work lives in handwritten adapter code.

## The downsides are real

Its not all easy code, and self-healing pipelines. Claude Code infra has some serious setbacks that may make them impossible for you to use.

| Downside | What happens |
| --- | --- |
| Cost | Cost is a stopper. A Claude Code pipeline doing the same job can easily cost 10x or 100x more than a traditional pipeline, especially once retries, long contexts, and subagents get involved. Traditional pipelines usually pay more of the price up front in engineering time and fixed infrastructure. Claude Code keeps charging you every run, and long-running workflows can burn through tens or even hundreds of millions of tokens. |
| Speed | An LLM reading and interpreting messy input is _significantly_ slower than a hardcoded parser that already knows what to expect. If the workflow runs thousands of times a day and needs sub-second response, this is probably the wrong tool. |
| Security | Python's interface tax acts as a crude safety boundary: the system can only reach what you explicitly wired up. Remove that friction and you have to replace it intentionally. Every pasted document, web page, or tool result is a possible instruction. Prompt injection is real; competitions like [HackAPrompt](https://www.hackaprompt.com/) exist because getting models to ignore instructions is a real and repeatable attack surface, not a theoretical one. You need tight scopes, explicit permissions, and a clear trust model. |
| Reliability | Traditional cron, PubSub, and monitoring are battle-tested. LLM-based orchestration is younger and less predictable. The model can take the wrong action, retry the wrong thing, or paper over a failure with a confident guess. [Replit's agent deleting a startup's production database](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/) is the kind of failure mode deterministic systems usually contain better. |

Where it does work, though, something interesting happens: the people who can build on your platform stop being limited to engineers. EMs can assemble workflows. PMs can prototype internal tools. Sales and finance can paste their data and get structured output without filing a ticket. The barrier drops from "can write Python" to "can clearly describe the work."

## When to use which

This is still new enough that I would not pretend to have a universal decision tree. But these are the heuristics I use in my own work:

### Reach for Claude Code when

- Inputs are messy, heterogeneous, or human-generated
- Small amounts of error are acceptable
- The output is text, code, reports, or structured summaries
- Non-technical people should be able to use it directly
- You have a small team, or no team, available to build it

### Reach for Python when

- You need deterministic contracts and repeatable behavior
- Latency or per-run cost matters
- Security boundaries have to be hard, not implied
- The same task runs at high volume
- A wrong answer is unacceptable

What changed for me is where the engineering effort sits. In these systems, the center of gravity moves away from parser code and toward guardrails, tool access, and clear task design. For workflows like this one, that trade is often worth making.

Published March 2026. Views are my own.
