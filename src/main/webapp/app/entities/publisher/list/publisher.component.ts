import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublisher } from '../publisher.model';
import { PublisherService } from '../service/publisher.service';
import { PublisherDeleteDialogComponent } from '../delete/publisher-delete-dialog.component';

@Component({
  selector: 'jhi-publisher',
  templateUrl: './publisher.component.html',
})
export class PublisherComponent implements OnInit {
  publishers?: IPublisher[];
  isLoading = false;

  constructor(protected publisherService: PublisherService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.publisherService.query().subscribe(
      (res: HttpResponse<IPublisher[]>) => {
        this.isLoading = false;
        this.publishers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPublisher): number {
    return item.id!;
  }

  delete(publisher: IPublisher): void {
    const modalRef = this.modalService.open(PublisherDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.publisher = publisher;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
