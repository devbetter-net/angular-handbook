import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TopicSandbox } from './components/topic-sandbox';
import { TopicTrack } from './data/handbook.data';
import { HandbookI18n } from './i18n/handbook-i18n';
import { SupportedLang } from './i18n/i18n.types';
import { HandbookProgress, WorkspaceView } from './state/handbook-progress';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule, TopicSandbox],
  templateUrl: './app.html',
})
export class App {
  readonly i18n = inject(HandbookI18n);
  readonly progress = inject(HandbookProgress);

  readonly heroImageFailed = signal(false);
  readonly copiedTopicId = signal<string | null>(null);
  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly trackTabs = computed<Array<{ id: 'all' | TopicTrack; label: string }>>(() => {
    const tracks = this.i18n.ui().sidebar.tracks;
    return [
      { id: 'all', label: tracks.all },
      { id: 'core', label: tracks.core },
      { id: 'reactive', label: tracks.reactive },
      { id: 'architecture', label: tracks.architecture },
    ];
  });

  readonly activeTrackLabel = computed<string>(() => {
    const tracks = this.i18n.ui().sidebar.tracks;
    return tracks[this.progress.selectedTrack()];
  });

  constructor() {
    this.searchControl.valueChanges.subscribe((value) => {
      this.progress.setSearchQuery(value);
    });
  }

  setView(view: WorkspaceView): void {
    this.progress.setView(view);
  }

  setLanguage(lang: SupportedLang): void {
    this.i18n.setLanguage(lang);
  }

  openTopic(topicId: string): void {
    this.progress.selectTopic(topicId);
  }

  toggleTopicFromSidebar(event: Event, topicId: string): void {
    event.stopPropagation();
    this.progress.toggleCompleted(topicId);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  async copyExampleCode(topicId: string, code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      this.copiedTopicId.set(topicId);
      setTimeout(() => {
        if (this.copiedTopicId() === topicId) {
          this.copiedTopicId.set(null);
        }
      }, 1800);
    } catch {
      // Clipboard access denied in sandboxed context.
    }
  }

  onHeroImageError(): void {
    this.heroImageFailed.set(true);
  }
}
