import { Component, computed, ElementRef, inject, input, OnDestroy, OnInit, viewChild } from '@angular/core';

import { ChatComponent } from '@sinequa/assistant/chat';

@Component({
  selector: 'sq-chat-wrapper',
  template: `
    @if(isReady()) {
      <sq-chat-v3 #sqChat
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
export class ChatWrapperComponent implements OnInit, OnDestroy {
  appConfig = input<any>();
  instanceId = input<string>();
  query = input<any>();
  sqChat = viewChild.required('sqChat', {read: ChatComponent});

  isReady = computed(
    () => !!this.appConfig() && !!this.instanceId() && !!this.query()
  );

  ngOnInit(): void {
    document.addEventListener('newDiscussion', this.handler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('newDiscussion', this.handler);
  }

  private handler = () => {
    this.sqChat()?.newChat();
  };

  onOpenPreview = (event: any) =>
    document.dispatchEvent(
      new CustomEvent('openPreview', { detail: event })
    );

  onOpenDocument = (event: any) =>
    document.dispatchEvent(
      new CustomEvent('openDocument', { detail: event })
    );
}
