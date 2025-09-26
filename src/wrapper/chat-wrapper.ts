import { Component, computed, ElementRef, inject, input } from '@angular/core';

import { ChatComponent } from '@sinequa/assistant/chat';

@Component({
  selector: 'sq-chat-wrapper',
  template: `
    @if(isReady()) {
      <sq-chat-v3
        [appConfig]="appConfig()!"
        [instanceId]="instanceId()!"
        [query]="query()!"
        (openDocument)="onOpenDocument($event)"
        (openPreview)="onOpenPreview($event)"
      />
    }
  `,
  standalone: true,
  imports: [ChatComponent],
})
export class ChatWrapperComponent {
  appConfig = input<any>();
  instanceId = input<any>();
  query = input<any>();

  isReady = computed(
    () => !!this.appConfig() && !!this.instanceId() && !!this.query()
  );

  el = inject(ElementRef);

  onOpenPreview = (event: any) =>
    this.el.nativeElement.dispatchEvent(
      new CustomEvent('openPreview', { detail: event })
    );

  onOpenDocument = (event: any) =>
    this.el.nativeElement.dispatchEvent(
      new CustomEvent('openDocument', { detail: event })
    );
}
