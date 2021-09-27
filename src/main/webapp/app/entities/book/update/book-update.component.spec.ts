jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BookService } from '../service/book.service';
import { IBook, Book } from '../book.model';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { PublisherService } from 'app/entities/publisher/service/publisher.service';

import { BookUpdateComponent } from './book-update.component';

describe('Component Tests', () => {
  describe('Book Management Update Component', () => {
    let comp: BookUpdateComponent;
    let fixture: ComponentFixture<BookUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bookService: BookService;
    let authorService: AuthorService;
    let publisherService: PublisherService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BookUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BookUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bookService = TestBed.inject(BookService);
      authorService = TestBed.inject(AuthorService);
      publisherService = TestBed.inject(PublisherService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Author query and add missing value', () => {
        const book: IBook = { id: 456 };
        const author: IAuthor = { id: 47336 };
        book.author = author;

        const authorCollection: IAuthor[] = [{ id: 29185 }];
        jest.spyOn(authorService, 'query').mockReturnValue(of(new HttpResponse({ body: authorCollection })));
        const additionalAuthors = [author];
        const expectedCollection: IAuthor[] = [...additionalAuthors, ...authorCollection];
        jest.spyOn(authorService, 'addAuthorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ book });
        comp.ngOnInit();

        expect(authorService.query).toHaveBeenCalled();
        expect(authorService.addAuthorToCollectionIfMissing).toHaveBeenCalledWith(authorCollection, ...additionalAuthors);
        expect(comp.authorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Publisher query and add missing value', () => {
        const book: IBook = { id: 456 };
        const publisher: IPublisher = { id: 65411 };
        book.publisher = publisher;

        const publisherCollection: IPublisher[] = [{ id: 41410 }];
        jest.spyOn(publisherService, 'query').mockReturnValue(of(new HttpResponse({ body: publisherCollection })));
        const additionalPublishers = [publisher];
        const expectedCollection: IPublisher[] = [...additionalPublishers, ...publisherCollection];
        jest.spyOn(publisherService, 'addPublisherToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ book });
        comp.ngOnInit();

        expect(publisherService.query).toHaveBeenCalled();
        expect(publisherService.addPublisherToCollectionIfMissing).toHaveBeenCalledWith(publisherCollection, ...additionalPublishers);
        expect(comp.publishersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const book: IBook = { id: 456 };
        const author: IAuthor = { id: 5685 };
        book.author = author;
        const publisher: IPublisher = { id: 56473 };
        book.publisher = publisher;

        activatedRoute.data = of({ book });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(book));
        expect(comp.authorsSharedCollection).toContain(author);
        expect(comp.publishersSharedCollection).toContain(publisher);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Book>>();
        const book = { id: 123 };
        jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ book });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: book }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bookService.update).toHaveBeenCalledWith(book);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Book>>();
        const book = new Book();
        jest.spyOn(bookService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ book });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: book }));
        saveSubject.complete();

        // THEN
        expect(bookService.create).toHaveBeenCalledWith(book);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Book>>();
        const book = { id: 123 };
        jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ book });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bookService.update).toHaveBeenCalledWith(book);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAuthorById', () => {
        it('Should return tracked Author primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAuthorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackPublisherById', () => {
        it('Should return tracked Publisher primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPublisherById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
