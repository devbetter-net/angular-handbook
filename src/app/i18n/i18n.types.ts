import { SandboxType, TopicTrack } from '../data/handbook.data';

export type SupportedLang = 'en' | 'vi';

export interface LocalizedTopicContent {
  id: string;
  order: string;
  directory: string;
  title: string;
  subtitle: string;
  track: TopicTrack;
  trackLabel: string;
  readingMinutes: number;
  sandboxType: SandboxType;
  concept: string;
  howItWorks: string;
  usage: string;
  example: {
    title: string;
    filename: string;
    code: string;
    explanation: string;
  };
  bestPractices: {
    recommended: string[];
    pitfalls: string[];
  };
  realWorldReference: string;
  officialDocUrl: string;
}

export interface HandbookLocaleBundle {
  meta: {
    lang: SupportedLang;
    label: string;
    pageTitle: string;
  };
  ui: {
    brand: string;
    nav: {
      overview: string;
      curriculum: string;
      approach: string;
      principles: string;
      sandboxCta: string;
      toggleSidebarAria: string;
    };
    language: {
      label: string;
      en: string;
      vi: string;
    };
    sidebar: {
      title: string;
      reviewedSuffix: string;
      trackProgressLabel: string;
      overallLabel: string;
      trackCompleteLabel: string;
      progressBarAria: string;
      markDoneAria: string;
      searchPlaceholder: string;
      searchAria: string;
      clearFilterAria: string;
      tracks: {
        all: string;
        core: string;
        reactive: string;
        architecture: string;
      };
      emptyTitle: string;
      resetFilters: string;
      reviewedBadgeAria: string;
    };
    overview: {
      kicker: string;
      heroTitle: string;
      startModuleCta: string;
      approachCta: string;
      imageAlt: string;
      imageFallbackTitle: string;
      imageFallbackSubtitle: string;
      curriculumHeading: string;
      curriculumSubheading: string;
      curriculumStats: string;
      sandboxBadge: string;
      minUnit: string;
      reviewedLabel: string;
      openLabel: string;
      relatedHeading: string;
      relatedDescription: string;
      tableHeaders: {
        repository: string;
        purpose: string;
        focus: string;
      };
      resourcesHeading: string;
    };
    topic: {
      studyUnit: string;
      readingTimeLabel: string;
      minReadSuffix: string;
      markedReviewed: string;
      markReviewed: string;
      step1Kicker: string;
      step1Heading: string;
      step2Kicker: string;
      step2Heading: string;
      step3Kicker: string;
      step3Heading: string;
      step4Kicker: string;
      copyCode: string;
      copied: string;
      step5Kicker: string;
      step5Heading: string;
      recommended: string;
      avoidPitfalls: string;
      step6Kicker: string;
      docLinkLabel: string;
    };
    approachView: {
      kicker: string;
      title: string;
      subtitle: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaButton: string;
    };
    principlesView: {
      kicker: string;
      title: string;
      subtitle: string;
      objectivesHeading: string;
      principlesHeading: string;
    };
    footer: {
      tagline: string;
      docs: string;
      tutorials: string;
      apiReference: string;
    };
  };
  sandbox: {
    executedLive: string;
    titles: Record<SandboxType, string>;
    signals: {
      writableCount: string;
      decrease: string;
      increase: string;
      reset: string;
      writableMultiplier: string;
      computedGraph: string;
      parityCheck: string;
      evenValue: string;
      oddValue: string;
    };
    templates: {
      switchSelector: string;
      all: string;
      core: string;
      reactive: string;
      simulateEmpty: string;
      emptyActive: string;
      showItems: string;
      renderedOutput: string;
      emptyRenderedTitle: string;
      emptyRenderedDesc: string;
      sampleItems: Array<{ id: string; name: string; category: 'core' | 'reactive' }>;
    };
    components: {
      parentScope: string;
      parentPropLabel: string;
      eventsReceived: string;
      countLabel: string;
      lastLabel: string;
      noneYet: string;
      childBoundary: string;
      receivedViaInput: string;
      untitledModule: string;
      emitOutputCta: string;
      defaultBadgeTitle: string;
    };
    di: {
      selectScope: string;
      rootScopeBtn: string;
      componentScopeBtn: string;
      rootDescription: string;
      componentDescription: string;
      componentA: string;
      componentB: string;
      instanceLabel: string;
      increment: string;
    };
    forms: {
      titleLabel: string;
      titlePlaceholder: string;
      titleError: string;
      emailLabel: string;
      emailPlaceholder: string;
      emailError: string;
      liveState: string;
      validationStatus: string;
      validLabel: string;
      invalidLabel: string;
      defaultTitle: string;
    };
  };
  overviewContent: {
    tagline: string;
    overview: string;
    objectives: string[];
    learningApproach: Array<{ step: string; title: string; description: string }>;
    principles: string[];
    learningResources: Array<{ label: string; url: string; summary: string }>;
    relatedProjects: Array<{ repository: string; purpose: string; focus: string }>;
  };
  topics: LocalizedTopicContent[];
}
