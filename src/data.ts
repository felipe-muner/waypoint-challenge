import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, "..", "data", "processed");

export const iep = JSON.parse(readFileSync(join(dataDir, "iep.json"), "utf-8")) as Iep;
export const lesson = JSON.parse(readFileSync(join(dataDir, "lesson.json"), "utf-8")) as Lesson;

export type Iep = {
  studentId: string;
  profile: {
    name: string;
    grade: string;
    age: number;
    disability: string;
    primaryLanguage: string;
    englishLearner: boolean;
    assistiveTechnology: boolean;
    iepDates: { from: string; to: string };
    caseManager: string;
    placement: string;
  };
  studentVision: {
    thisYear: Record<string, string>;
    longTerm: string[];
  };
  presentLevels: {
    ela: {
      currentGrade: string;
      readingLevel: string;
      subscores: Record<string, string>;
      canDo: string[];
      struggles: string[];
      behavioralPattern: string;
    };
    math: { currentLevel: string; canDo: string[]; struggles: string[] };
    behavioralSocialEmotional: {
      summary: string;
      vulnerableToBullying: boolean;
      pattern: string;
    };
  };
  strengthsAndInterests: string[];
  accommodations: {
    presentationOfInstruction: { id: string; name: string }[];
    response: { id: string; name: string }[];
    timingAndScheduling: { id: string; name: string }[];
    settingAndEnvironment: { id: string; name: string }[];
    modifications: { id: string; scope: string; name: string }[];
  };
  mcasAccommodations: string[];
  goals: {
    id: string;
    area: string;
    annualGoal: string;
    benchmarks: string[];
    owner: string;
  }[];
  services: { goal: string; type: string; location: string; frequency: string }[];
  teacherNotes: string[];
};

export type Lesson = {
  lessonId: string;
  curriculum: string;
  unit: string;
  lessonNumber: number;
  title: string;
  author: string;
  textType: string;
  gradeLevel: string;
  standard: string;
  knowledgeFocus: string;
  skillFocus: string;
  totalTimeMinutes: number;
  pacing: { part: string; minutes: number; activity: string }[];
  vocabulary: { word: string; definition: string }[];
  centralIdea: string;
  textParagraphs: { n: number; section: string; text: string }[];
  duringReadingQuestions: {
    id: string;
    paragraphs: string;
    type: string;
    question: string;
    modelAnswer?: string;
    optional?: boolean;
  }[];
  multipleChoice: {
    id: string;
    standard: string;
    stem: string;
    choices: string[];
    answer: string;
  }[];
  shortResponse: {
    id: string;
    standard: string;
    prompt: string;
    rubricExpectations: string[];
  };
  discussionQuestions: string[];
};

export function flatAccommodations(): { id: string; name: string; category: string }[] {
  const a = iep.accommodations;
  return [
    ...a.presentationOfInstruction.map((x) => ({ ...x, category: "Presentation" })),
    ...a.response.map((x) => ({ ...x, category: "Response" })),
    ...a.timingAndScheduling.map((x) => ({ ...x, category: "Timing/Scheduling" })),
    ...a.settingAndEnvironment.map((x) => ({ ...x, category: "Setting/Environment" })),
    ...a.modifications.map((x) => ({ id: x.id, name: x.name, category: `Modification — ${x.scope}` })),
  ];
}
