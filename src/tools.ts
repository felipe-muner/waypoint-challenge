import { iep, lesson, flatAccommodations } from "./data.js";

export function differentiateLesson(args: { focus?: "during_reading" | "independent_practice" | "discussion" | "all" }) {
  const focus = args.focus ?? "all";
  const ela = iep.presentLevels.ela;
  const accs = flatAccommodations();

  const accommodationCues = [
    {
      lessonMoment: "Before reading (intro slide deck, 5 min)",
      cues: [
        `Pre-teach vocab using a printed reference sheet [${accs.find((a) => a.id === "R-1")!.id}]: solidarity, dispersed, narrative, aspect, moral.`,
        `Sit Jasmine in the front of the room [${accs.find((a) => a.id === "S-2")!.id}].`,
        `State the lesson's one big question on the board: "What makes a group a community?" — repeat directions [${accs.find((a) => a.id === "PI-1")!.id}].`,
      ],
    },
    {
      lessonMoment: "During reading questions (15 min, paragraphs 1–11)",
      cues: [
        `Provide a printed copy of teacher's annotation model for paragraphs 1–2 [${accs.find((a) => a.id === "PI-3")!.id}].`,
        `Use the scaffolded paragraph rewrites (see scaffold_text tool) for paragraphs 5–7 — Jasmine reads at Grade 3, the text is Grade 7.`,
        `Pre-position a scheduled break after paragraph 7 [${accs.find((a) => a.id === "T-4")!.id}] — this is where the partner-reading section ends and a stamina dip is likely.`,
        `1:1 check-in immediately before DRQ-2a (paragraphs 3–7 Write question) [${accs.find((a) => a.id === "T-3")!.id}] — this is where independent inferential writing begins.`,
        `Frame small-group support as the default seating arrangement, not a pull-out, since Jasmine declines offered small-group ELA 80% of the time [${accs.find((a) => a.id === "S-1")!.id}].`,
      ],
    },
    {
      lessonMoment: "Independent practice (20 min, MC + short response)",
      cues: [
        `Hand out the Central Idea Graphic Organizer (see build_graphic_organizer tool) BEFORE the short response [${accs.find((a) => a.id === "R-1")!.id}, MCAS A9].`,
        `Allow extra time [${accs.find((a) => a.id === "T-1")!.id}] — 30 min instead of 20.`,
        `Reminder to pause/plan/proceed before Jasmine starts the short response [${accs.find((a) => a.id === "PI-2")!.id}].`,
        `If Jasmine puts her head down or asks for the bathroom (her shutdown signal), redirect to the calming-strategy menu before the work — do not send her out [counseling goal-1 alignment].`,
      ],
    },
    {
      lessonMoment: "Student-led discussion (5 min)",
      cues: [
        `Pair Jasmine with a peer she has a positive relationship with — she's motivated by talking with peers.`,
        `Provide a sentence-starter checklist [${accs.find((a) => a.id === "R-1")!.id}]: "A community I belong to is ___ because we share ___."`,
        `Specific positive praise after she contributes — generic praise is not motivating for her.`,
      ],
    },
  ];

  const scaffoldedQuestions = [
    {
      replaces: "drq-1c (Turn & Talk: summarize 3 key traits of a community)",
      tier: "Two-step scaffold",
      jasmineVersion: [
        "Step 1 (multiple choice): Which is a key trait of a community? (a) Same height (b) Shared story (c) Same age",
        "Step 2 (sentence frame): A community is a group of people who ____. They share a ____.",
      ],
      groundedIn: "Vocabulary subscore Grade 3 + 'requires significant adult support to organize her thinking for writing tasks'.",
    },
    {
      replaces: "drq-2a (Write: How does the Newcastle example support Lowe's definition?)",
      tier: "Sentence-frame scaffold with text-anchored choices",
      jasmineVersion: [
        "Lowe says he is part of the Newcastle community because he chooses to ____ (act like a Geordie / live in Newcastle / visit Newcastle).",
        "This supports his definition because a community is a group of people who share a ____.",
        "One example from the text is that he ____ (cite paragraph 6).",
      ],
      groundedIn: "ELA Goal 3 benchmark: 'write a claim that accurately answers each part of the question' and 'find effective pieces of textual evidence' — the frame teaches the structure.",
    },
    {
      replaces: "drq-3b (Write: 3 reasons Lowe's definition works)",
      tier: "Reduce to two reasons + checklist",
      jasmineVersion: [
        "Pick TWO reasons from this list and copy them into your own words:",
        "  ☐ A shared story works for places, religions, or interests.",
        "  ☐ A shared story makes people feel they belong.",
        "  ☐ A shared story shapes what people think is good or bad.",
        "  ☐ A shared story lets people belong to more than one community.",
      ],
      groundedIn: "Reduces output demand (low writing stamina) without lowering the standard — still RI.7.2 central idea + supporting details.",
    },
  ];

  const modifiedShortResponse = {
    originalPrompt: lesson.shortResponse.prompt,
    jasmineVersion: {
      promptStem: "Lowe says a community is 'a group of people who share an identity-forming narrative.' What does that mean? Use the organizer below.",
      organizer: [
        "1) In my own words, Lowe means: ________________________________________",
        "2) One example from the text is in paragraph __: ________________________",
        "3) Another example from the text is in paragraph __: ____________________",
        "4) The unit vocabulary word I used is: __________ which means: __________",
      ],
      rubricMapping: "Same RI.7.2 standard, same 4 rubric expectations as original, but the cognitive load of organizing the response is offloaded to the organizer.",
    },
    groundedIn: "Present levels: 'Jasmine requires significant adult support to organize her thinking for writing tasks. With 1:1 support she can participate in writing at grade level.' The organizer replaces the 1:1 support with a structural support.",
  };

  const alternativeAssessment = {
    purpose: "If shutdown happens during the short response, here's a same-standard alternative that uses Jasmine's strengths (drawing, talking).",
    options: [
      {
        type: "Verbal explanation",
        description: "Jasmine explains Lowe's definition verbally to the teacher in a 1:1 check-in (record on phone). Score against the same 4 rubric expectations.",
      },
      {
        type: "Visual representation",
        description: "Jasmine draws a community she belongs to and labels: (1) the shared story, (2) two character traits members share, (3) one tradition or event. Aligns with her interest in drawing and the 'identity-forming narrative' concept.",
      },
    ],
  };

  const udlAlignment = {
    representation: "Vocabulary pre-teach + scaffolded paragraph rewrites + teacher-annotated model paragraph give multiple ways to access the text.",
    actionAndExpression: "Sentence frames, graphic organizer, and verbal/visual alternatives let Jasmine show understanding in multiple ways.",
    engagement: "Front-row seating, peer pairing for discussion, specific positive praise, and pre-positioned breaks reduce frustration before it triggers shutdown.",
  };

  const sections: Record<string, unknown> = {
    studentSummary: {
      name: iep.profile.name,
      grade: iep.profile.grade,
      readingLevel: ela.readingLevel,
      lessonGradeLevel: lesson.gradeLevel,
      gap: "~4 grade levels below text complexity",
      keyPattern: ela.behavioralPattern,
    },
    accommodationCues,
    scaffoldedQuestions,
    modifiedShortResponse,
    alternativeAssessment,
    udlAlignment,
  };

  if (focus === "during_reading") return { studentSummary: sections.studentSummary, accommodationCues: accommodationCues.slice(0, 2), scaffoldedQuestions };
  if (focus === "independent_practice") return { studentSummary: sections.studentSummary, accommodationCues: accommodationCues.filter((c) => c.lessonMoment.startsWith("Independent")), modifiedShortResponse, alternativeAssessment };
  if (focus === "discussion") return { studentSummary: sections.studentSummary, accommodationCues: accommodationCues.filter((c) => c.lessonMoment.startsWith("Student-led")) };
  return sections;
}

export function scaffoldText(args: { paragraphNumber: number }) {
  const para = lesson.textParagraphs.find((p) => p.n === args.paragraphNumber);
  if (!para) return { error: `Paragraph ${args.paragraphNumber} not found` };

  const rewrites: Record<number, { vocabPreTeach: { word: string; kidFriendly: string }[]; rewrite: string; checkForUnderstanding: string }> = {
    5: {
      vocabPreTeach: [
        { word: "manifestations", kidFriendly: "signs that show something is happening" },
        { word: "slighted", kidFriendly: "feel insulted" },
        { word: "Geordie", kidFriendly: "a person from Newcastle, England" },
      ],
      rewrite:
        "Lowe is part of the Newcastle community. He shows people around the city and feels proud. When people say bad things about Newcastle, he feels insulted. When he hears the Newcastle accent, he feels at home.",
      checkForUnderstanding: "What are TWO things that show Lowe is part of the Newcastle community? (Hint: look for what he feels and what he does.)",
    },
    6: {
      vocabPreTeach: [
        { word: "character traits", kidFriendly: "the way a person acts" },
        { word: "adopted", kidFriendly: "took on as his own" },
      ],
      rewrite:
        "Lowe chose to make Newcastle's story part of his own story. People from Newcastle are supposed to be friendly, talk to strangers at bus stops, and cheer for Newcastle's soccer team. Lowe acts this way too. He goes to Newcastle's events. He cares about Newcastle's future like it is his own future.",
      checkForUnderstanding: "What does Lowe DO that shows he chose Newcastle's story as his own? Name ONE thing.",
    },
    7: {
      vocabPreTeach: [],
      rewrite:
        "What makes Lowe part of Newcastle is his CHOICE. It is not just where he lives. Some people live in Newcastle but are not part of the community. Some people moved away but are still part of the community, because they still talk about it and care about it.",
      checkForUnderstanding: "True or false: You can live in a place and not be part of its community. Why?",
    },
    9: {
      vocabPreTeach: [{ word: "aspect", kidFriendly: "one part of something" }],
      rewrite:
        "Lowe says it again to be clear: A community is a group of people who share a story. The story is so important to them that it becomes part of who they are.",
      checkForUnderstanding: "Fill in: A community is a group of people who share a ____.",
    },
  };

  const rewrite = rewrites[args.paragraphNumber];
  if (!rewrite) {
    return {
      paragraphNumber: args.paragraphNumber,
      original: para.text,
      note:
        "No pre-built rewrite for this paragraph. To scaffold: (1) chunk into 2-3 sentences max, (2) replace any word above Grade 4 with a kid-friendly synonym, (3) end with one literal-recall question that mirrors the paragraph's main idea.",
    };
  }

  return {
    paragraphNumber: args.paragraphNumber,
    original: para.text,
    targetReadingLevel: "Grade 3 (Jasmine's iReady level)",
    vocabPreTeach: rewrite.vocabPreTeach,
    scaffoldedRewrite: rewrite.rewrite,
    checkForUnderstanding: rewrite.checkForUnderstanding,
    groundedIn:
      "Present levels: 'requires significant adult support to break down complex vocabulary, sentence structures, and key ideas.' The rewrite reduces sentence length and vocabulary load without changing the central idea, preserving alignment to RI.7.2.",
  };
}

export function buildGraphicOrganizer(args: { type?: "central_idea" | "claim_evidence_analysis" }) {
  const type = args.type ?? "central_idea";

  if (type === "central_idea") {
    return {
      title: "Central Idea & Supporting Details — \"What is 'community'?\"",
      mcasAccommodation: "A9 — Department-approved graphic organizer",
      iepGoalAlignment: "ELA Goal 3 benchmarks: annotate for focus & supporting detail; identify main idea.",
      organizer: [
        "TOP BOX — CENTRAL IDEA (one sentence):",
        "  Lowe says a community is _________________________________________________.",
        "",
        "DETAIL 1 (from paragraph ___):",
        "  ________________________________________________________________________",
        "  This supports the central idea because _________________________________.",
        "",
        "DETAIL 2 (from paragraph ___):",
        "  ________________________________________________________________________",
        "  This supports the central idea because _________________________________.",
        "",
        "DETAIL 3 (from paragraph ___):",
        "  ________________________________________________________________________",
        "  This supports the central idea because _________________________________.",
        "",
        "BOTTOM BOX — IN ONE SENTENCE, what does Lowe want us to understand?",
        "  ________________________________________________________________________",
      ].join("\n"),
      teacherTip:
        "Pre-fill the paragraph numbers (e.g., 'from paragraph 5') for Jasmine's copy — locating evidence is a separate skill she's still developing per Goal 3 benchmark 4.",
    };
  }

  return {
    title: "Claim → Evidence → Analysis",
    mcasAccommodation: "A9 — Department-approved graphic organizer",
    organizer: [
      "QUESTION: ___________________________________________________________________",
      "",
      "MY CLAIM (answers EVERY part of the question):",
      "  _____________________________________________________________________________",
      "",
      "EVIDENCE 1 (from paragraph ___): \"____________________________________________\"",
      "  ANALYSIS: This shows my claim is true because _____________________________",
      "",
      "EVIDENCE 2 (from paragraph ___): \"____________________________________________\"",
      "  ANALYSIS: This shows my claim is true because _____________________________",
      "",
      "EVIDENCE 3 (from paragraph ___): \"____________________________________________\"",
      "  ANALYSIS: This shows my claim is true because _____________________________",
    ].join("\n"),
  };
}

export function lessonAlignedAccommodations() {
  const result = differentiateLesson({ focus: "all" }) as { accommodationCues: unknown };
  return result.accommodationCues;
}
