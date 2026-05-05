#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { iep, lesson } from "./data.js";
import {
  differentiateLesson,
  scaffoldText,
  buildGraphicOrganizer,
  lessonAlignedAccommodations,
} from "./tools.js";

const server = new Server(
  { name: "waypoint-iep-mcp", version: "0.1.0" },
  { capabilities: { resources: {}, tools: {} } }
);

// ----- Resources -----
// Granular IEP and lesson sections so the model can pull only what it needs.
const resources = [
  { uri: "iep://profile", name: "Student profile (Jasmine Bailey)", mimeType: "application/json", get: () => iep.profile },
  { uri: "iep://student-vision", name: "Student vision and goals", mimeType: "application/json", get: () => iep.studentVision },
  { uri: "iep://present-levels/ela", name: "Present levels — ELA", mimeType: "application/json", get: () => iep.presentLevels.ela },
  { uri: "iep://present-levels/math", name: "Present levels — Math", mimeType: "application/json", get: () => iep.presentLevels.math },
  { uri: "iep://present-levels/behavioral", name: "Present levels — Behavioral/Social/Emotional", mimeType: "application/json", get: () => iep.presentLevels.behavioralSocialEmotional },
  { uri: "iep://strengths", name: "Strengths and interests", mimeType: "application/json", get: () => iep.strengthsAndInterests },
  { uri: "iep://accommodations", name: "Classroom accommodations and modifications", mimeType: "application/json", get: () => iep.accommodations },
  { uri: "iep://goals", name: "Annual goals and benchmarks", mimeType: "application/json", get: () => iep.goals },
  { uri: "iep://services", name: "Service delivery", mimeType: "application/json", get: () => iep.services },
  { uri: "iep://teacher-notes", name: "Teacher-facing context notes", mimeType: "application/json", get: () => iep.teacherNotes },
  { uri: "lesson://overview", name: "Lesson overview and pacing", mimeType: "application/json", get: () => ({
      lessonId: lesson.lessonId, unit: lesson.unit, title: lesson.title, author: lesson.author, gradeLevel: lesson.gradeLevel,
      standard: lesson.standard, knowledgeFocus: lesson.knowledgeFocus, skillFocus: lesson.skillFocus,
      totalTimeMinutes: lesson.totalTimeMinutes, pacing: lesson.pacing, centralIdea: lesson.centralIdea,
    }) },
  { uri: "lesson://text", name: "Lesson text — paragraphs", mimeType: "application/json", get: () => lesson.textParagraphs },
  { uri: "lesson://vocabulary", name: "Lesson vocabulary", mimeType: "application/json", get: () => lesson.vocabulary },
  { uri: "lesson://during-reading", name: "During-reading questions", mimeType: "application/json", get: () => lesson.duringReadingQuestions },
  { uri: "lesson://assessment", name: "Independent practice (MC + short response)", mimeType: "application/json", get: () => ({
      multipleChoice: lesson.multipleChoice, shortResponse: lesson.shortResponse,
    }) },
  { uri: "lesson://discussion", name: "Student-led discussion questions", mimeType: "application/json", get: () => lesson.discussionQuestions },
];

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: resources.map(({ uri, name, mimeType }) => ({ uri, name, mimeType })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
  const r = resources.find((x) => x.uri === req.params.uri);
  if (!r) throw new Error(`Resource not found: ${req.params.uri}`);
  return {
    contents: [{ uri: r.uri, mimeType: r.mimeType, text: JSON.stringify(r.get(), null, 2) }],
  };
});

// ----- Tools -----
const tools = [
  {
    name: "differentiate_lesson",
    description:
      "Produce a structured, teacher-ready differentiation plan for the loaded lesson and student. Returns: student summary, accommodation cues mapped to each lesson moment (pre-positioned, not reactive), scaffolded versions of specific during-reading questions, a modified short-response with built-in graphic organizer, an alternative assessment, and UDL alignment notes. Every modification cites the specific IEP accommodation or present-level it grounds in. Use focus=during_reading | independent_practice | discussion | all.",
    inputSchema: {
      type: "object",
      properties: {
        focus: {
          type: "string",
          enum: ["during_reading", "independent_practice", "discussion", "all"],
          description: "Which part of the lesson to differentiate. Default: all.",
        },
      },
    },
  },
  {
    name: "scaffold_text",
    description:
      "Return a Grade-3 reading-level rewrite of a specific paragraph from the lesson text, with vocabulary pre-teach and a literal check-for-understanding. Use for paragraphs Jasmine will read independently. Args: paragraphNumber (1–11).",
    inputSchema: {
      type: "object",
      required: ["paragraphNumber"],
      properties: {
        paragraphNumber: { type: "integer", description: "Paragraph number from the source text (1–11)." },
      },
    },
  },
  {
    name: "build_graphic_organizer",
    description:
      "Build a printable graphic organizer aligned to MCAS accommodation A9 and IEP Goal 3. Type 'central_idea' (default) for the short-response prompt. Type 'claim_evidence_analysis' for any text-based writing.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["central_idea", "claim_evidence_analysis"] },
      },
    },
  },
  {
    name: "lesson_aligned_accommodations",
    description:
      "Return only the accommodation cues — IEP accommodations mapped to the specific minute-by-minute moments of this lesson. Use this when the teacher wants a quick pre-class checklist without the full differentiation plan.",
    inputSchema: { type: "object", properties: {} },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  let result: unknown;
  switch (name) {
    case "differentiate_lesson":
      result = differentiateLesson((args ?? {}) as { focus?: "during_reading" | "independent_practice" | "discussion" | "all" });
      break;
    case "scaffold_text":
      result = scaffoldText(args as { paragraphNumber: number });
      break;
    case "build_graphic_organizer":
      result = buildGraphicOrganizer((args ?? {}) as { type?: "central_idea" | "claim_evidence_analysis" });
      break;
    case "lesson_aligned_accommodations":
      result = lessonAlignedAccommodations();
      break;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// ----- Run -----
const transport = new StdioServerTransport();
await server.connect(transport);
// stderr only — stdout is the MCP transport
console.error("waypoint-iep-mcp listening on stdio");
