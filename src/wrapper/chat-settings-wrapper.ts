import { Component, computed, ElementRef, inject, input } from '@angular/core';

import { ChatSettingsV3Component } from '@sinequa/assistant/chat';

@Component({
  selector: 'sq-chat-settings-wrapper',
  template: `
    @if(isReady()) {
      <sq-chat-settings-v3
        [instanceId]="instanceId()!"
        (update)="close()"
        (cancel)="close()"
      />
    }
  `,
  standalone: true,
  imports: [ChatSettingsV3Component]
})
export class ChatSettingsWrapperComponent {
  instanceId = input<any>();

  isReady = computed(
    () => !!this.instanceId()
  );

  el = inject(ElementRef);

  close() {
    this.el.nativeElement.style.display = 'none';
  }

}
