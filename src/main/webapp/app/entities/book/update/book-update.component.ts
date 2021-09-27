import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBook, Book } from '../book.model';
import { BookService } from '../service/book.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { PublisherService } from 'app/entities/publisher/service/publisher.service';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html',
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;

  authorsSharedCollection: IAuthor[] = [];
  publishersSharedCollection: IPublisher[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    pageNo: [],
    author: [],
    publisher: [],
  });

  constructor(
    protected bookService: BookService,
    protected authorService: AuthorService,
    protected publisherService: PublisherService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      this.updateForm(book);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.createFromForm();
    if (book.id !== undefined) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  trackAuthorById(index: number, item: IAuthor): number {
    return item.id!;
  }

  trackPublisherById(index: number, item: IPublisher): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
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

  protected updateForm(book: IBook): void {
    this.editForm.patchValue({
      id: book.id,
      title: book.title,
      pageNo: book.pageNo,
      author: book.author,
      publisher: book.publisher,
    });

    this.authorsSharedCollection = this.authorService.addAuthorToCollectionIfMissing(this.authorsSharedCollection, book.author);
    this.publishersSharedCollection = this.publisherService.addPublisherToCollectionIfMissing(
      this.publishersSharedCollection,
      book.publisher
    );
  }

  protected loadRelationshipsOptions(): void {
    this.authorService
      .query()
      .pipe(map((res: HttpResponse<IAuthor[]>) => res.body ?? []))
      .pipe(map((authors: IAuthor[]) => this.authorService.addAuthorToCollectionIfMissing(authors, this.editForm.get('author')!.value)))
      .subscribe((authors: IAuthor[]) => (this.authorsSharedCollection = authors));

    this.publisherService
      .query()
      .pipe(map((res: HttpResponse<IPublisher[]>) => res.body ?? []))
      .pipe(
        map((publishers: IPublisher[]) =>
          this.publisherService.addPublisherToCollectionIfMissing(publishers, this.editForm.get('publisher')!.value)
        )
      )
      .subscribe((publishers: IPublisher[]) => (this.publishersSharedCollection = publishers));
  }

  protected createFromForm(): IBook {
    return {
      ...new Book(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      pageNo: this.editForm.get(['pageNo'])!.value,
      author: this.editForm.get(['author'])!.value,
      publisher: this.editForm.get(['publisher'])!.value,
    };
  }
}
