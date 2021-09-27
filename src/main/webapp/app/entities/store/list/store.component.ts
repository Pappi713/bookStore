import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStore } from '../store.model';
import { StoreService } from '../service/store.service';
import { StoreDeleteDialogComponent } from '../delete/store-delete-dialog.component';

@Component({
  selector: 'jhi-store',
  templateUrl: './store.component.html',
})
export class StoreComponent implements OnInit {
  stores?: IStore[];
  isLoading = false;

  constructor(protected storeService: StoreService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.storeService.query().subscribe(
      (res: HttpResponse<IStore[]>) => {
        this.isLoading = false;
        this.stores = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStore): number {
    return item.id!;
  }

  delete(store: IStore): void {
    const modalRef = this.modalService.open(StoreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.store = store;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
