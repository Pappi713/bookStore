jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StoreService } from '../service/store.service';
import { IStore, Store } from '../store.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';

import { StoreUpdateComponent } from './store-update.component';

describe('Component Tests', () => {
  describe('Store Management Update Component', () => {
    let comp: StoreUpdateComponent;
    let fixture: ComponentFixture<StoreUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let storeService: StoreService;
    let bookService: BookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StoreUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(StoreUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StoreUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      storeService = TestBed.inject(StoreService);
      bookService = TestBed.inject(BookService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Book query and add missing value', () => {
        const store: IStore = { id: 456 };
        const books: IBook[] = [{ id: 20128 }];
        store.books = books;

        const bookCollection: IBook[] = [{ id: 41299 }];
        jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
        const additionalBooks = [...books];
        const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
        jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ store });
        comp.ngOnInit();

        expect(bookService.query).toHaveBeenCalled();
        expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(bookCollection, ...additionalBooks);
        expect(comp.booksSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const store: IStore = { id: 456 };
        const books: IBook = { id: 30210 };
        store.books = [books];

        activatedRoute.data = of({ store });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(store));
        expect(comp.booksSharedCollection).toContain(books);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Store>>();
        const store = { id: 123 };
        jest.spyOn(storeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ store });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: store }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(storeService.update).toHaveBeenCalledWith(store);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Store>>();
        const store = new Store();
        jest.spyOn(storeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ store });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: store }));
        saveSubject.complete();

        // THEN
        expect(storeService.create).toHaveBeenCalledWith(store);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Store>>();
        const store = { id: 123 };
        jest.spyOn(storeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ store });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(storeService.update).toHaveBeenCalledWith(store);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBookById', () => {
        it('Should return tracked Book primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBookById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedBook', () => {
        it('Should return option if no Book is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedBook(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Book for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedBook(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Book is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedBook(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
