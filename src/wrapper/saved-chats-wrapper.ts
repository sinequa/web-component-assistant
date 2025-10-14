import { Component, computed, ElementRef, inject, input } from '@angular/core';

import { SavedChatsComponent } from '@sinequa/assistant/chat';

@Component({
  selector: 'sq-saved-chats-wrapper',
  template: `
    @if(isReady()) {
      <sq-saved-chats-v3
        [instanceId]="instanceId()!"
      />
    }
  `,
  standalone: true,
  imports: [SavedChatsComponent]
})
export class SavedChatsWrapperComponent {
  instanceId = input<any>();

  isReady = computed(
    () => !!this.instanceId()
  );

}
