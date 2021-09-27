import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublisher } from '../publisher.model';
import { PublisherService } from '../service/publisher.service';

@Component({
  templateUrl: './publisher-delete-dialog.component.html',
})
export class PublisherDeleteDialogComponent {
  publisher?: IPublisher;

  constructor(protected publisherService: PublisherService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.publisherService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
