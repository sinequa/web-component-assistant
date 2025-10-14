import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { DocumentListComponent, DocumentsUploadService, DocumentUploadComponent } from '@sinequa/assistant/chat';
import { TranslocoPipe } from '@jsverse/transloco';
import { take } from 'rxjs';

@Component({
  selector: 'sq-document-upload-wrapper',
  template: `
    <dialog popover #dialog>
      <div class="modal-header">
        <h4>{{'uploadToSources' | transloco}}</h4>
        <button class="btn btn-light" (click)="closeDialog()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <main class="modal-body">
        <sq-document-upload></sq-document-upload>

        <hr />
        <div class="modal-actions">
          <button class="btn btn-danger me-1" (click)="deleteAllDocuments()" [title]="'deleteAll' | transloco">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-light" (click)="refreshListDocument()" [title]="'refresh' | transloco">
            <i class="fas fa-sync"></i>
          </button>
        </div>

        <sq-document-list #sqDocumentList></sq-document-list>
      </main>
    </dialog>
  `,
  standalone: true,
  imports: [TranslocoPipe, DocumentUploadComponent, DocumentListComponent]
})
export class DocumentUploadWrapperComponent {
  dialog = viewChild.required('dialog', {read: ElementRef<HTMLDialogElement>});
  sqDocumentList = viewChild.required('sqDocumentList', {read: DocumentListComponent});

  private documentsUploadService = inject(DocumentsUploadService);
  el = inject(ElementRef);

  ngOnInit(): void {
    document.addEventListener('openUploadDialog', this.handler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('openUploadDialog', this.handler);
  }

  private handler = () => {
    this.dialog()?.nativeElement.showModal();
  };

  refreshListDocument() {
    this.documentsUploadService.getDocumentsList().pipe(take(1)).subscribe();
  }

  deleteAllDocuments() {
    this.sqDocumentList().deleteAllDocuments();
  }

  closeDialog() {
    this.dialog().nativeElement.close();
  }
}
