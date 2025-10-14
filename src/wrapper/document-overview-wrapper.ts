import { Component, computed, ElementRef, inject } from '@angular/core';
import { DocumentOverviewComponent, DocumentsUploadService } from '@sinequa/assistant/chat';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'sq-document-overview-wrapper',
  template: `
    <sq-document-overview
      [disabledUpload]="disabledUpload()"
      (onUpload)="openUploadDialog()">
    </sq-document-overview>
  `,
  standalone: true,
  imports: [DocumentOverviewComponent]
})
export class DocumentOverviewWrapperComponent {

  private documentsUploadService = inject(DocumentsUploadService);
  el = inject(ElementRef);

  private uploadConfig = toSignal(this.documentsUploadService.uploadConfig$);

  readonly disabledUpload = computed(
    () => !(this.uploadConfig()?.documentsUploadEnabled)
  );

  openUploadDialog = () => {
    document.dispatchEvent(new CustomEvent('openUploadDialog'));
  }


}
