import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPublisher, Publisher } from '../publisher.model';
import { PublisherService } from '../service/publisher.service';

@Component({
  selector: 'jhi-publisher-update',
  templateUrl: './publisher-update.component.html',
})
export class PublisherUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    location: [],
  });

  constructor(protected publisherService: PublisherService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ publisher }) => {
      this.updateForm(publisher);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const publisher = this.createFromForm();
    if (publisher.id !== undefined) {
      this.subscribeToSaveResponse(this.publisherService.update(publisher));
    } else {
      this.subscribeToSaveResponse(this.publisherService.create(publisher));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPublisher>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(publisher: IPublisher): void {
    this.editForm.patchValue({
      id: publisher.id,
      name: publisher.name,
      location: publisher.location,
    });
  }

  protected createFromForm(): IPublisher {
    return {
      ...new Publisher(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
