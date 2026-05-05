# Waypoint Challenge — IEP-aware Lesson Differentiation MCP

An MCP server that gives Claude the context to turn a 7th-grade ELA lesson plan plus a 35-page IEP into specific, teacher-usable instructional modifications in seconds instead of hours.

The included sample data is **CommonLit 360 Unit 1 Lesson 1 — "What is 'community'?"** (Toby Lowe, RI.7.2 central idea) and **Jasmine Bailey's IEP** (7th grade, Health Impairment, ELA at Grade 3 reading level vs. a Grade 7 text).

---

## Run it

```bash
npm install
npm run build
npm start              # stdio MCP server

# Or run with the MCP inspector (recommended for evaluation):
npm run inspect
```

**60-second tour in the Inspector.** Click **Connect**, then **Tools** tab → **List Tools**, and run these in order:

1. `scaffold_text` with `paragraphNumber: 6` — Grade-3 rewrite of a Grade-7 paragraph + vocab pre-teach
2. `differentiate_lesson` with `focus: "independent_practice"` — modified short-response with built-in organizer + alternative assessment
3. `build_graphic_organizer` with no args — printable central-idea organizer
4. `differentiate_lesson` with no args — full lesson plan (all 4 lesson moments + scaffolded DRQs + UDL alignment)

Then **Resources** tab → **List Resources** to see the chunked IEP and lesson sections the tools read from.

### Use it from Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "waypoint-iep": {
      "command": "node",
      "args": ["/absolute/path/to/waypoint-challenge/dist/server.js"]
    }
  }
}
```

Restart Claude Desktop. Then ask things like:

> Differentiate tomorrow's CommonLit "What is community?" lesson for Jasmine. Focus on the independent practice section.

> Give me a Grade 3 rewrite of paragraph 6 with vocabulary pre-teach.

> Build me a central-idea graphic organizer for the short response.

---

## Architecture

The repo is a small MCP server in TypeScript. Two design choices drive output quality:

### 1. Semantically chunked resources (not document blobs)

The PDFs were preprocessed once into structured JSON:

- `data/processed/iep.json` — split by IEP section (profile, present-levels per subject, accommodations, goals with benchmarks, services, teacher-facing context notes)
- `data/processed/lesson.json` — split by lesson part (overview, text paragraphs, during-reading questions, MC/short-response, discussion)

Each section is exposed as its own MCP resource (16 in total):

```
iep://profile
iep://present-levels/ela
iep://present-levels/behavioral
iep://accommodations
iep://goals
iep://teacher-notes
lesson://overview
lesson://text
lesson://during-reading
lesson://assessment
...
```

**Why:** the IEP says different things matter for ELA, math, and behavioral planning. If Claude is differentiating a reading lesson it should pull `present-levels/ela` and `goals` — not the full 35-page document. Granular URIs keep context clean and let the same server serve any consumer (a teacher UI, an agent loop, the Claude Desktop client).

### 2. Tools that return structured artifacts, not advice

A teacher with no prep time doesn't want "here's a strategy you might try." They want a printable organizer, a paragraph rewrite they can read aloud, a checklist of cues mapped to specific minutes of class. The four tools all return *artifacts*:

| Tool | What it returns | Grounding |
|---|---|---|
| `differentiate_lesson` | Per-lesson-moment accommodation cues, scaffolded versions of specific DRQs, a modified short-response with built-in organizer, an alternative assessment, UDL alignment | Each cue/scaffold cites the IEP accommodation ID (`PI-1`, `R-1`, …) or the specific present-level it grounds in |
| `scaffold_text` | Grade-3 rewrite of a specific paragraph + vocab pre-teach + check-for-understanding | Jasmine's iReady reading level + the "requires significant adult support to break down complex vocabulary" note |
| `build_graphic_organizer` | Printable central-idea organizer or claim/evidence/analysis organizer | MCAS A9 accommodation + ELA Goal 3 benchmarks (annotation, evidence, analysis) |
| `lesson_aligned_accommodations` | Just the per-minute checklist (subset of above) | Same as above |

**Every modification names the IEP element it grounds in.** That's how the teacher trusts the output enough to use it.

### Two non-obvious things the modifications get right

These come from carefully reading the IEP rather than applying generic UDL:

1. **Pre-position breaks, don't react to shutdowns.** The IEP says Jasmine's pattern is *frustration → silent disengagement → bathroom requests*. By the time you see the head go down, the lesson is already lost. The plan pre-positions a scheduled break after paragraph 7 (where partner reading ends and stamina dips) and a 1:1 check-in immediately *before* the first inferential write-prompt — not after she's stuck.

2. **Don't frame supports as pull-outs.** The IEP notes Jasmine declines offered small-group ELA 80% of the time despite needing it. The plan recommends framing the small group as default seating, not a pullout — a domain decision, not a technical one.

### What I deliberately did not do

- **No PDF parsing at runtime.** The challenge is about how Claude reasons over IEP+lesson, not OCR. Preprocessing once into clean JSON is what a real product would do anyway.
- **No fine-tuning, no RAG.** The dataset is one student and one lesson. A retriever would add latency and a hallucination surface for zero gain.
- **No web UI.** The challenge specs the MCP server. The UX in this repo is "Claude Desktop or Inspector + the four tools." The artifacts the tools return are designed to render straight into a teacher-facing UI when there is one (each is JSON with predictable shape).

---

## Example output (abridged)

**Tool call:** `differentiate_lesson({ focus: "independent_practice" })`

```json
{
  "studentSummary": {
    "name": "Jasmine Regina Bailey",
    "readingLevel": "Grade 3 (iReady Fall 2025)",
    "lessonGradeLevel": "7",
    "gap": "~4 grade levels below text complexity",
    "keyPattern": "Frustration on grade-level literacy → quietly disengages (head down, repeated bathroom requests)."
  },
  "accommodationCues": [
    {
      "lessonMoment": "Independent practice (20 min, MC + short response)",
      "cues": [
        "Hand out the Central Idea Graphic Organizer BEFORE the short response [R-1, MCAS A9].",
        "Allow extra time [T-1] — 30 min instead of 20.",
        "Reminder to pause/plan/proceed before Jasmine starts the short response [PI-2].",
        "If Jasmine puts her head down or asks for the bathroom, redirect to the calming-strategy menu — do not send her out [counseling goal-1 alignment]."
      ]
    }
  ],
  "modifiedShortResponse": {
    "originalPrompt": "Explain what Lowe means when he says a community is 'a group of people who share an identity-forming narrative.' Use at least two details from the text...",
    "jasmineVersion": {
      "promptStem": "Lowe says a community is 'a group of people who share an identity-forming narrative.' What does that mean? Use the organizer below.",
      "organizer": [
        "1) In my own words, Lowe means: ___________________________________",
        "2) One example from the text is in paragraph __: ____________________",
        "3) Another example from the text is in paragraph __: ___________________",
        "4) The unit vocabulary word I used is: __________ which means: __________"
      ],
      "rubricMapping": "Same RI.7.2 standard, same 4 rubric expectations as original, but the cognitive load of organizing the response is offloaded to the organizer."
    },
    "groundedIn": "Present levels: 'Jasmine requires significant adult support to organize her thinking for writing tasks. With 1:1 support she can participate in writing at grade level.' The organizer replaces the 1:1 support with a structural support."
  },
  "alternativeAssessment": {
    "purpose": "If shutdown happens during the short response, here's a same-standard alternative that uses Jasmine's strengths (drawing, talking).",
    "options": [
      {
        "type": "Visual representation",
        "description": "Jasmine draws a community she belongs to and labels: (1) the shared story, (2) two character traits members share, (3) one tradition or event. Aligns with her interest in drawing and the 'identity-forming narrative' concept."
      }
    ]
  }
}
```

**Tool call:** `scaffold_text({ paragraphNumber: 6 })`

```json
{
  "paragraphNumber": 6,
  "original": "But what makes me part of this community is my choice to write Newcastle's stories into my own story...",
  "targetReadingLevel": "Grade 3 (Jasmine's iReady level)",
  "vocabPreTeach": [
    { "word": "character traits", "kidFriendly": "the way a person acts" },
    { "word": "adopted", "kidFriendly": "took on as his own" }
  ],
  "scaffoldedRewrite": "Lowe chose to make Newcastle's story part of his own story. People from Newcastle are supposed to be friendly, talk to strangers at bus stops, and cheer for Newcastle's soccer team. Lowe acts this way too. He goes to Newcastle's events. He cares about Newcastle's future like it is his own future.",
  "checkForUnderstanding": "What does Lowe DO that shows he chose Newcastle's story as his own? Name ONE thing.",
  "groundedIn": "Present levels: 'requires significant adult support to break down complex vocabulary, sentence structures, and key ideas.' The rewrite reduces sentence length and vocabulary load without changing the central idea, preserving alignment to RI.7.2."
}
```

---

## Repo layout

```
data/
  iep.pdf                     # NOT in this repo — source materials are not redistributed
  lesson.pdf                  # NOT in this repo — see Note on Data below
  processed/
    iep.json                  # chunked IEP — what the server actually serves
    lesson.json               # chunked lesson
src/
  data.ts                     # types + JSON loader
  tools.ts                    # the four tools
  server.ts                   # MCP wiring (stdio transport, resources, tools)
```

## A note on the source data

Per the challenge brief ("Please don't redistribute these materials outside the context of this challenge"), the original `iep.pdf` and `lesson.pdf` are **not** committed to this public repo. The structured JSON in `data/processed/` is my own interpretation/chunking of those documents and is included so the architecture is fully readable.

The server runs against `data/processed/*.json` — it never reads the PDFs at runtime — so the demo works as-is from a clone.

## Trade-offs and what I'd do next

- **Hand-curated rewrites in `scaffold_text`.** For paragraphs 5, 6, 7, 9 the rewrites are pre-built. Other paragraphs return scaffolding *guidance* and rely on Claude to author the rewrite using the patterns in the curated examples. In a real product these would all be Claude-generated at request time with the present-level + reading-level subscores in context — I wanted the tool to be deterministic for the demo and for the rubric ("would a teacher actually use this?").
- **One student, one lesson.** Multi-student / multi-lesson would require a `students` and `lessons` index resource, plus arguments on every tool. Easy extension — kept out of scope here per the challenge brief ("a thoughtful, well-structured solution that handles one lesson well is better than a sprawling system").
- **No state.** Progress monitoring (Goal 1's "4 out of 5 opportunities") is the obvious next surface area — the IEP already encodes the criteria. A `log_observation` tool plus a `progress_summary` tool would close the loop the founder describes ("tight feedback loops so teachers know what's working").
