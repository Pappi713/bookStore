import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStore, Store } from '../store.model';
import { StoreService } from '../service/store.service';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';

@Component({
  selector: 'jhi-store-update',
  templateUrl: './store-update.component.html',
})
export class StoreUpdateComponent implements OnInit {
  isSaving = false;

  booksSharedCollection: IBook[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    adress: [],
    books: [],
  });

  constructor(
    protected storeService: StoreService,
    protected bookService: BookService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ store }) => {
      this.updateForm(store);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const store = this.createFromForm();
    if (store.id !== undefined) {
      this.subscribeToSaveResponse(this.storeService.update(store));
    } else {
      this.subscribeToSaveResponse(this.storeService.create(store));
    }
  }

  trackBookById(index: number, item: IBook): number {
    return item.id!;
  }

  getSelectedBook(option: IBook, selectedVals?: IBook[]): IBook {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStore>>): void {
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

  protected updateForm(store: IStore): void {
    this.editForm.patchValue({
      id: store.id,
      name: store.name,
      adress: store.adress,
      books: store.books,
    });

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing(this.booksSharedCollection, ...(store.books ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing(books, ...(this.editForm.get('books')!.value ?? []))))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));
  }

  protected createFromForm(): IStore {
    return {
      ...new Store(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      adress: this.editForm.get(['adress'])!.value,
      books: this.editForm.get(['books'])!.value,
    };
  }
}
