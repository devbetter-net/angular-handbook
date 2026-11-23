import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import enBundle from '../../assets/i18n/en.json';
import viBundle from '../../assets/i18n/vi.json';
import { HandbookLocaleBundle, SupportedLang } from './i18n.types';

const LANG_STORAGE_KEY = 'angular-handbook-lang-v1';

const LOCALE_BUNDLES: Record<SupportedLang, HandbookLocaleBundle> = {
  en: enBundle as HandbookLocaleBundle,
  vi: viBundle as HandbookLocaleBundle,
};

@Injectable({
  providedIn: 'root',
})
export class HandbookI18n {
  private readonly document = inject(DOCUMENT);

  private readonly _lang = signal<SupportedLang>(this.loadInitialLang());
  readonly lang = this._lang.asReadonly();

  readonly bundle = computed<HandbookLocaleBundle>(() => LOCALE_BUNDLES[this._lang()]);
  readonly ui = computed(() => this.bundle().ui);
  readonly sandbox = computed(() => this.bundle().sandbox);
  readonly overview = computed(() => this.bundle().overviewContent);
  readonly topics = computed(() => this.bundle().topics);

  constructor() {
    effect(() => {
      const currentLang = this._lang();
      const title = this.bundle().meta.pageTitle;
      this.document.documentElement.lang = currentLang;
      this.document.title = title;
      try {
        localStorage.setItem(LANG_STORAGE_KEY, currentLang);
      } catch {
        // Ignore storage write failures in restricted browsing contexts.
      }
    });
  }

  setLanguage(lang: SupportedLang): void {
    this._lang.set(lang);
  }

  private loadInitialLang(): SupportedLang {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') {
        return saved;
      }
    } catch {
      // Ignore storage read failures.
    }
    return 'en';
  }
}
