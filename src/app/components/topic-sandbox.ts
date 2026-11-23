import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SandboxType } from '../data/handbook.data';
import { HandbookI18n } from '../i18n/handbook-i18n';

@Component({
  selector: 'app-topic-sandbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    @let sb = i18n.sandbox();
    <section
      class="ah-box is-clipped"
      aria-label="Interactive Angular Sandbox"
    >
      <div
        class="is-flex is-flex-wrap-wrap is-justify-content-space-between is-align-items-center px-5 py-3"
        style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; gap: 0.75rem;"
      >
        <div class="is-flex is-align-items-center" style="gap: 0.5rem;">
          <mat-icon class="ah-icon-md ah-text-rose">tune</mat-icon>
          <h3 class="is-size-6 has-text-weight-semibold m-0">
            {{ sb.titles[sandboxType()] }}
          </h3>
        </div>
        <span class="is-size-7 ah-text-subtle">{{ sb.executedLive }}</span>
      </div>

      @switch (sandboxType()) {
        @case ('signals') {
          <div class="columns is-gapless m-0">
            <div class="column is-7 p-5" style="border-right: 1px solid #e2e8f0;">
              <div class="is-flex is-flex-wrap-wrap is-justify-content-space-between is-align-items-center mb-5" style="gap: 1rem;">
                <div>
                  <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-1">{{ sb.signals.writableCount }}</p>
                  <p class="is-size-2 has-text-weight-semibold is-family-monospace tabular-nums m-0">{{ sigCount() }}</p>
                </div>
                <div class="buttons are-small m-0">
                  <button
                    type="button"
                    (click)="decrementSig()"
                    class="button is-white"
                    style="border-color: #cbd5e1;"
                  >
                    <span class="icon is-small"><mat-icon class="ah-icon-xs">remove</mat-icon></span>
                    <span>{{ sb.signals.decrease }}</span>
                  </button>
                  <button
                    type="button"
                    (click)="incrementSig()"
                    class="button is-dark"
                  >
                    <span class="icon is-small"><mat-icon class="ah-icon-xs">add</mat-icon></span>
                    <span>{{ sb.signals.increase }}</span>
                  </button>
                  <button
                    type="button"
                    (click)="resetSig()"
                    class="button is-light"
                  >
                    <span class="icon is-small"><mat-icon class="ah-icon-xs">restart_alt</mat-icon></span>
                    <span>{{ sb.signals.reset }}</span>
                  </button>
                </div>
              </div>

              <div>
                <div class="is-flex is-justify-content-space-between is-size-7 mb-2">
                  <label for="multiplier-range" class="has-text-weight-medium">
                    {{ sb.signals.writableMultiplier }}
                  </label>
                  <span class="is-family-monospace tabular-nums has-text-weight-semibold">{{ sigMultiplier() }}x</span>
                </div>
                <input
                  id="multiplier-range"
                  type="range"
                  min="1"
                  max="10"
                  [value]="sigMultiplier()"
                  (input)="onMultiplierChange($event)"
                  style="width: 100%; accent-color: #be123c; cursor: pointer;"
                />
                <div class="is-flex is-justify-content-space-between is-family-monospace tabular-nums ah-text-subtle" style="font-size: 0.7rem;">
                  <span>1x</span>
                  <span>5x</span>
                  <span>10x</span>
                </div>
              </div>
            </div>

            <div class="column is-5 p-5" style="background-color: #f8fafc;">
              <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-3">{{ sb.signals.computedGraph }}</p>
              <div class="columns is-mobile mb-3">
                <div class="column is-6">
                  <div class="ah-box p-3">
                    <p class="is-size-7 ah-text-subtle mb-1">product()</p>
                    <p class="is-size-4 has-text-weight-semibold is-family-monospace tabular-nums m-0">{{ sigProduct() }}</p>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="ah-box p-3">
                    <p class="is-size-7 ah-text-subtle mb-1">squared()</p>
                    <p class="is-size-4 has-text-weight-semibold is-family-monospace tabular-nums m-0">{{ sigSquared() }}</p>
                  </div>
                </div>
              </div>
              <div class="ah-box p-3 is-flex is-justify-content-space-between is-align-items-center">
                <span class="is-size-7 ah-text-muted">{{ sb.signals.parityCheck }}</span>
                <span
                  class="icon-text is-size-7 has-text-weight-semibold"
                  [class.ah-text-emerald]="sigIsEven()"
                  [class.has-text-info-dark]="!sigIsEven()"
                >
                  <span class="icon is-small"><mat-icon class="ah-icon-xs">{{ sigIsEven() ? 'check_circle' : 'adjust' }}</mat-icon></span>
                  <span>{{ sigIsEven() ? sb.signals.evenValue : sb.signals.oddValue }}</span>
                </span>
              </div>
            </div>
          </div>
        }

        @case ('templates') {
          <div class="columns is-gapless m-0">
            <div class="column is-5 p-5" style="border-right: 1px solid #e2e8f0;">
              <div class="mb-4">
                <p class="is-size-7 has-text-weight-medium ah-text-muted mb-2">{{ sb.templates.switchSelector }}</p>
                <div class="ah-segmented" role="group">
                  <button
                    type="button"
                    (click)="tplFilter.set('all')"
                    class="ah-seg-btn"
                    [class.is-active]="tplFilter() === 'all'"
                  >
                    {{ sb.templates.all }}
                  </button>
                  <button
                    type="button"
                    (click)="tplFilter.set('core')"
                    class="ah-seg-btn"
                    [class.is-active]="tplFilter() === 'core'"
                  >
                    {{ sb.templates.core }}
                  </button>
                  <button
                    type="button"
                    (click)="tplFilter.set('reactive')"
                    class="ah-seg-btn"
                    [class.is-active]="tplFilter() === 'reactive'"
                  >
                    {{ sb.templates.reactive }}
                  </button>
                </div>
              </div>

              <div class="is-flex is-justify-content-space-between is-align-items-center pt-3" style="border-top: 1px solid #f1f5f9; gap: 0.75rem;">
                <span class="is-size-7 has-text-weight-medium">{{ sb.templates.simulateEmpty }}</span>
                <button
                  type="button"
                  (click)="tplForceEmpty.set(!tplForceEmpty())"
                  class="button is-small"
                  [class.is-danger]="tplForceEmpty()"
                  [class.is-light]="tplForceEmpty()"
                  [class.is-white]="!tplForceEmpty()"
                  style="border-color: #cbd5e1;"
                >
                  <span class="icon is-small"><mat-icon class="ah-icon-xs">{{ tplForceEmpty() ? 'visibility_off' : 'visibility' }}</mat-icon></span>
                  <span>{{ tplForceEmpty() ? sb.templates.emptyActive : sb.templates.showItems }}</span>
                </button>
              </div>
            </div>

            <div class="column is-7 p-5" style="background-color: #f8fafc;">
              <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-3">{{ sb.templates.renderedOutput }}</p>
              <div class="is-flex is-flex-direction-column" style="gap: 0.5rem;">
                @for (item of visibleTplItems(); track item.id) {
                  <div class="ah-box px-4 py-3 is-flex is-justify-content-space-between is-align-items-center is-size-7">
                    <span class="has-text-weight-semibold">{{ item.name }}</span>
                    <span class="is-family-monospace ah-text-subtle">track: {{ item.id }}</span>
                  </div>
                } @empty {
                  <div class="ah-box p-5 has-text-centered" style="border-style: dashed;">
                    <p class="is-size-7 has-text-weight-semibold mb-1">{{ sb.templates.emptyRenderedTitle }}</p>
                    <p class="is-size-7 ah-text-subtle m-0">{{ sb.templates.emptyRenderedDesc }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        @case ('components') {
          <div class="columns is-gapless m-0">
            <div class="column is-6 p-5" style="border-right: 1px solid #e2e8f0;">
              <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-3">{{ sb.components.parentScope }}</p>
              <div class="field mb-4">
                <label for="parent-label-input" class="label is-small">
                  {{ sb.components.parentPropLabel }}
                </label>
                <div class="control">
                  <input
                    id="parent-label-input"
                    type="text"
                    [formControl]="parentLabelControl"
                    class="input is-small"
                  />
                </div>
              </div>
              <div class="ah-box p-3" style="background-color: #f8fafc;">
                <p class="is-size-7 ah-text-subtle mb-1">{{ sb.components.eventsReceived }}</p>
                <p class="is-size-7 has-text-weight-semibold is-family-monospace tabular-nums m-0">
                  {{ sb.components.countLabel }}: {{ childEventsCount() }} · {{ sb.components.lastLabel }}: {{ lastChildEvent() ?? sb.components.noneYet }}
                </p>
              </div>
            </div>

            <div class="column is-6 p-5" style="background-color: #f8fafc;">
              <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-3">{{ sb.components.childBoundary }}</p>
              <div class="ah-box p-4">
                <p class="is-size-7 ah-text-subtle mb-1">{{ sb.components.receivedViaInput }}</p>
                <p class="is-size-6 has-text-weight-semibold mb-3">{{ parentLabelControl.value || sb.components.untitledModule }}</p>
                <button
                  type="button"
                  (click)="emitChildEvent()"
                  class="button is-dark is-small"
                >
                  <span class="icon is-small"><mat-icon class="ah-icon-xs">north_west</mat-icon></span>
                  <span>{{ sb.components.emitOutputCta }}</span>
                </button>
              </div>
            </div>
          </div>
        }

        @case ('di') {
          <div class="columns is-gapless m-0">
            <div class="column is-6 p-5" style="border-right: 1px solid #e2e8f0;">
              <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-3">{{ sb.di.selectScope }}</p>
              <div class="ah-segmented mb-3" role="group">
                <button
                  type="button"
                  (click)="diScope.set('root')"
                  class="ah-seg-btn"
                  [class.is-active]="diScope() === 'root'"
                >
                  {{ sb.di.rootScopeBtn }}
                </button>
                <button
                  type="button"
                  (click)="diScope.set('component')"
                  class="ah-seg-btn"
                  [class.is-active]="diScope() === 'component'"
                >
                  {{ sb.di.componentScopeBtn }}
                </button>
              </div>
              <p class="is-size-7 ah-text-muted m-0">
                {{ diScope() === 'root' ? sb.di.rootDescription : sb.di.componentDescription }}
              </p>
            </div>

            <div class="column is-6 p-5" style="background-color: #f8fafc;">
              <div class="columns is-mobile">
                <div class="column is-6">
                  <div class="ah-box p-3">
                    <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-1">{{ sb.di.componentA }}</p>
                    <p class="is-size-7 is-family-monospace has-text-weight-semibold tabular-nums mb-2">
                      {{ sb.di.instanceLabel }} #{{ diScope() === 'root' ? '01' : 'A1' }} · {{ diCountA() }}
                    </p>
                    <button
                      type="button"
                      (click)="incrementDi('a')"
                      class="button is-small is-white"
                      style="border-color: #cbd5e1;"
                    >
                      <span class="icon is-small"><mat-icon class="ah-icon-xs">add</mat-icon></span>
                      <span>{{ sb.di.increment }}</span>
                    </button>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="ah-box p-3">
                    <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-1">{{ sb.di.componentB }}</p>
                    <p class="is-size-7 is-family-monospace has-text-weight-semibold tabular-nums mb-2">
                      {{ sb.di.instanceLabel }} #{{ diScope() === 'root' ? '01' : 'B2' }} · {{ diScope() === 'root' ? diCountA() : diCountB() }}
                    </p>
                    <button
                      type="button"
                      (click)="incrementDi('b')"
                      class="button is-small is-white"
                      style="border-color: #cbd5e1;"
                    >
                      <span class="icon is-small"><mat-icon class="ah-icon-xs">add</mat-icon></span>
                      <span>{{ sb.di.increment }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        @case ('forms') {
          <div class="columns is-gapless m-0">
            <form [formGroup]="demoForm" class="column is-6 p-5" style="border-right: 1px solid #e2e8f0;">
              <div class="field">
                <label for="demo-topic-title" class="label is-small">
                  {{ sb.forms.titleLabel }}
                </label>
                <div class="control">
                  <input
                    id="demo-topic-title"
                    type="text"
                    formControlName="title"
                    [placeholder]="sb.forms.titlePlaceholder"
                    class="input is-small"
                    [class.is-danger]="demoForm.controls.title.touched && demoForm.controls.title.invalid"
                  />
                </div>
                @if (demoForm.controls.title.touched && demoForm.controls.title.invalid) {
                  <p class="help is-danger icon-text">
                    <span class="icon is-small"><mat-icon class="ah-icon-xs">error_outline</mat-icon></span>
                    <span>{{ sb.forms.titleError }}</span>
                  </p>
                }
              </div>

              <div class="field mb-0">
                <label for="demo-author-email" class="label is-small">
                  {{ sb.forms.emailLabel }}
                </label>
                <div class="control">
                  <input
                    id="demo-author-email"
                    type="email"
                    formControlName="email"
                    [placeholder]="sb.forms.emailPlaceholder"
                    class="input is-small"
                    [class.is-danger]="demoForm.controls.email.touched && demoForm.controls.email.invalid"
                  />
                </div>
                @if (demoForm.controls.email.touched && demoForm.controls.email.invalid) {
                  <p class="help is-danger icon-text">
                    <span class="icon is-small"><mat-icon class="ah-icon-xs">error_outline</mat-icon></span>
                    <span>{{ sb.forms.emailError }}</span>
                  </p>
                }
              </div>
            </form>

            <div class="column is-6 p-5" style="background-color: #f8fafc;">
              <p class="is-size-7 has-text-weight-medium ah-text-subtle mb-3">{{ sb.forms.liveState }}</p>
              <div class="ah-box p-3 is-flex is-justify-content-space-between is-align-items-center mb-3">
                <span class="is-size-7 ah-text-muted">{{ sb.forms.validationStatus }}</span>
                <span
                  class="icon-text is-size-7 has-text-weight-semibold"
                  [class.ah-text-emerald]="demoForm.valid"
                  [class.ah-text-rose]="demoForm.invalid"
                >
                  <span class="icon is-small"><mat-icon class="ah-icon-xs">{{ demoForm.valid ? 'check_circle' : 'cancel' }}</mat-icon></span>
                  <span>{{ demoForm.valid ? sb.forms.validLabel : sb.forms.invalidLabel }}</span>
                </span>
              </div>
              <div class="ah-box p-3 is-size-7 is-family-monospace ah-text-muted">
                <div>dirty: {{ demoForm.dirty }}</div>
                <div>touched: {{ demoForm.touched }}</div>
                <div>title: "{{ demoForm.controls.title.value }}"</div>
              </div>
            </div>
          </div>
        }
      }
    </section>
  `,
})
export class TopicSandbox {
  readonly i18n = inject(HandbookI18n);
  readonly sandboxType = input.required<SandboxType>();

  // Signals Sandbox
  readonly sigCount = signal(2);
  readonly sigMultiplier = signal(3);
  readonly sigProduct = computed(() => this.sigCount() * this.sigMultiplier());
  readonly sigSquared = computed(() => this.sigProduct() * this.sigProduct());
  readonly sigIsEven = computed(() => this.sigProduct() % 2 === 0);

  // Templates Control Flow Sandbox
  readonly tplFilter = signal<'all' | 'core' | 'reactive'>('all');
  readonly tplForceEmpty = signal(false);
  readonly visibleTplItems = computed(() => {
    if (this.tplForceEmpty()) {
      return [];
    }
    const items = this.i18n.sandbox().templates.sampleItems;
    const filter = this.tplFilter();
    return filter === 'all' ? items : items.filter((item) => item.category === filter);
  });

  // Component Communication Sandbox
  readonly parentLabelControl = new FormControl(this.i18n.sandbox().components.defaultBadgeTitle, {
    nonNullable: true,
  });
  readonly childEventsCount = signal(0);
  readonly lastChildEvent = signal<string | null>(null);

  // DI Hierarchy Sandbox
  readonly diScope = signal<'root' | 'component'>('root');
  readonly diCountA = signal(1);
  readonly diCountB = signal(1);

  // Typed Reactive Forms Sandbox
  readonly demoForm = new FormGroup({
    title: new FormControl(this.i18n.sandbox().forms.defaultTitle, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)],
    }),
    email: new FormControl('learner@angular.dev', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  constructor() {
    effect(() => {
      const defaultTitle = this.i18n.sandbox().components.defaultBadgeTitle;
      if (!this.parentLabelControl.dirty) {
        this.parentLabelControl.setValue(defaultTitle, { emitEvent: false });
      }
    });
  }

  incrementSig(): void {
    this.sigCount.update((c) => c + 1);
  }

  decrementSig(): void {
    this.sigCount.update((c) => c - 1);
  }

  resetSig(): void {
    this.sigCount.set(2);
    this.sigMultiplier.set(3);
  }

  onMultiplierChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.sigMultiplier.set(Number(target.value));
  }

  emitChildEvent(): void {
    const next = this.childEventsCount() + 1;
    this.childEventsCount.set(next);
    this.lastChildEvent.set(`selected#${next}`);
  }

  incrementDi(target: 'a' | 'b'): void {
    if (this.diScope() === 'root' || target === 'a') {
      this.diCountA.update((n) => n + 1);
      return;
    }
    this.diCountB.update((n) => n + 1);
  }
}
