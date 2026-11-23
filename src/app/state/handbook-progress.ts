import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { TopicTrack } from '../data/handbook.data';
import { HandbookI18n } from '../i18n/handbook-i18n';
import { LocalizedTopicContent } from '../i18n/i18n.types';

export type WorkspaceView = 'overview' | 'topic' | 'approach' | 'principles';

const COMPLETED_STORAGE_KEY = 'angular-handbook-completed-v1';

@Injectable({
  providedIn: 'root',
})
export class HandbookProgress {
  private readonly i18n = inject(HandbookI18n);

  readonly topics = this.i18n.topics;

  readonly activeView = signal<WorkspaceView>('overview');
  readonly selectedTopicId = signal<string>('fundamentals');
  readonly selectedTrack = signal<'all' | TopicTrack>('all');
  readonly searchQuery = signal<string>('');
  readonly mobileSidebarOpen = signal<boolean>(false);

  private readonly _completedIds = signal<string[]>(this.loadCompletedIds());
  readonly completedIds = this._completedIds.asReadonly();

  readonly filteredTopics = computed<LocalizedTopicContent[]>(() => {
    const track = this.selectedTrack();
    const query = this.searchQuery().trim().toLowerCase();

    return this.topics().filter((topic) => {
      const matchesTrack = track === 'all' || topic.track === track;
      if (!matchesTrack) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        topic.title.toLowerCase().includes(query) ||
        topic.directory.toLowerCase().includes(query) ||
        topic.subtitle.toLowerCase().includes(query) ||
        topic.concept.toLowerCase().includes(query)
      );
    });
  });

  readonly selectedTopic = computed<LocalizedTopicContent>(() => {
    const id = this.selectedTopicId();
    const list = this.topics();
    return list.find((t) => t.id === id) ?? list[0];
  });

  readonly selectedTopicIndex = computed<number>(() => {
    const id = this.selectedTopicId();
    return this.topics().findIndex((t) => t.id === id);
  });

  readonly previousTopic = computed<LocalizedTopicContent | null>(() => {
    const idx = this.selectedTopicIndex();
    const list = this.topics();
    return idx > 0 ? list[idx - 1] : null;
  });

  readonly nextTopic = computed<LocalizedTopicContent | null>(() => {
    const idx = this.selectedTopicIndex();
    const list = this.topics();
    return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  });

  readonly completedCount = computed<number>(() => this._completedIds().length);
  readonly totalCount = computed<number>(() => this.topics().length);
  readonly progressPercent = computed<number>(() =>
    Math.round((this.completedCount() / this.totalCount()) * 100),
  );

  readonly trackTopics = computed<LocalizedTopicContent[]>(() => {
    const track = this.selectedTrack();
    return track === 'all'
      ? this.topics()
      : this.topics().filter((topic) => topic.track === track);
  });

  readonly trackCompletedCount = computed<number>(() => {
    const completed = this._completedIds();
    return this.trackTopics().filter((topic) => completed.includes(topic.id)).length;
  });

  readonly trackTotalCount = computed<number>(() => this.trackTopics().length);

  readonly trackProgressPercent = computed<number>(() => {
    const total = this.trackTotalCount();
    return total > 0 ? Math.round((this.trackCompletedCount() / total) * 100) : 0;
  });

  readonly isTrackComplete = computed<boolean>(
    () => this.trackTotalCount() > 0 && this.trackCompletedCount() === this.trackTotalCount(),
  );

  constructor() {
    effect(() => {
      const ids = this._completedIds();
      try {
        localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(ids));
      } catch {
        // Ignore storage write failures in restricted browsing contexts.
      }
    });
  }

  isCompleted(topicId: string): boolean {
    return this._completedIds().includes(topicId);
  }

  estimateReadingMinutes(topic: LocalizedTopicContent): number {
    const prose = [
      topic.title,
      topic.subtitle,
      topic.concept,
      topic.howItWorks,
      topic.usage,
      topic.example.title,
      topic.example.explanation,
      topic.realWorldReference,
      ...topic.bestPractices.recommended,
      ...topic.bestPractices.pitfalls,
    ].join(' ');
    const wordCount = prose.trim().split(/\s+/).filter(Boolean).length;
    const codeLines = topic.example.code.split('\n').length;
    const baseMinutes = Math.ceil(wordCount / 160 + codeLines / 14);
    const sandboxMinutes = topic.sandboxType !== 'none' ? 2 : 0;
    return Math.max(2, baseMinutes + sandboxMinutes);
  }

  toggleCompleted(topicId: string): void {
    this._completedIds.update((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  }

  selectTopic(topicId: string): void {
    this.selectedTopicId.set(topicId);
    this.activeView.set('topic');
    this.mobileSidebarOpen.set(false);
  }

  setView(view: WorkspaceView): void {
    this.activeView.set(view);
    this.mobileSidebarOpen.set(false);
  }

  setTrack(track: 'all' | TopicTrack): void {
    this.selectedTrack.set(track);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  openInteractiveSandbox(): void {
    this.selectedTopicId.set('signals');
    this.activeView.set('topic');
    this.mobileSidebarOpen.set(false);
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((open) => !open);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  private loadCompletedIds(): string[] {
    try {
      const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      const validIds = new Set(this.topics().map((t) => t.id));
      return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
    } catch {
      return [];
    }
  }
}
