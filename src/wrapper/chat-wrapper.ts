import { Component, computed, input, OnDestroy, OnInit, viewChild } from '@angular/core';

import { ChatComponent, InitChat, MessageHandler, SuggestedAction } from '@sinequa/assistant/chat';
import { AppGlobalConfig, Query } from '@sinequa/atomic';

@Component({
  selector: 'sq-chat-wrapper',
  template: `
    @if(isReady()) {
      <sq-chat-v3 #sqChat
        [appConfig]="appConfig()!"
        [instanceId]="instanceId()!"
        [query]="query()!"
        [chat]="chat()"
        [messageHandlers]="messageHandlers()"
        [automaticScrollToLastResponse]="automaticScrollToLastResponse()"
        [assistantMessageIcon]="assistantMessageIcon()"
        [userMessageIcon]="userMessageIcon()"
        [connectionErrorMessageIcon]="connectionErrorMessageIcon()"
        [searchWarningMessageIcon]="searchWarningMessageIcon()"
        [additionalWorkflowProperties]="additionalWorkflowProperties()"

        (openDocument)="onOpenDocument($event)"
        (openPreview)="onOpenPreview($event)"
        (suggestAction)="onSuggestAction($event)"
      />
    }
  `,
  standalone: true,
  imports: [ChatComponent],
})
export class ChatWrapperComponent implements OnInit, OnDestroy {
  appConfig = input<AppGlobalConfig>();
  instanceId = input<string>();
  query = input<Query>();
  chat = input<InitChat>();
  messageHandlers = input< Map<string, MessageHandler<any>>>(new Map());
  automaticScrollToLastResponse = input<boolean>(false);
  assistantMessageIcon = input<string>('sq-sinequa');
  userMessageIcon = input<string>('');
  connectionErrorMessageIcon = input<string>('');
  searchWarningMessageIcon = input<string>('');
  additionalWorkflowProperties = input<Record<string, any>>({});

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

  onSuggestAction(action: SuggestedAction) {
      switch (action.type) {
        case "Prefill":
          this.insertText(action.content);
          break;
        case "Submit":
          this.submitQuestion(action.content);
          break;
        default:
          console.log("Assistant's unknown suggested action type: " + action.type);
      }
    }

    submitQuestion(question: string) {
        this.sqChat().question = question;
        this.sqChat().submitQuestion();
    }

    insertText(text: string): void {
      const start = this.sqChat().questionInput!.nativeElement.selectionStart;
      const end = this.sqChat().questionInput!.nativeElement.selectionEnd;
      this.sqChat().question = this.sqChat().question.substring(0, start) + text + this.sqChat().question.substring(end, this.sqChat().question.length);
      this.sqChat().questionInput!.nativeElement.value = this.sqChat().question;
    }
}
