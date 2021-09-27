import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStore, Store } from '../store.model';

import { StoreService } from './store.service';

describe('Service Tests', () => {
  describe('Store Service', () => {
    let service: StoreService;
    let httpMock: HttpTestingController;
    let elemDefault: IStore;
    let expectedResult: IStore | IStore[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(StoreService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        adress: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Store', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Store()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Store', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            adress: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Store', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            adress: 'BBBBBB',
          },
          new Store()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Store', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            adress: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Store', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addStoreToCollectionIfMissing', () => {
        it('should add a Store to an empty array', () => {
          const store: IStore = { id: 123 };
          expectedResult = service.addStoreToCollectionIfMissing([], store);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(store);
        });

        it('should not add a Store to an array that contains it', () => {
          const store: IStore = { id: 123 };
          const storeCollection: IStore[] = [
            {
              ...store,
            },
            { id: 456 },
          ];
          expectedResult = service.addStoreToCollectionIfMissing(storeCollection, store);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Store to an array that doesn't contain it", () => {
          const store: IStore = { id: 123 };
          const storeCollection: IStore[] = [{ id: 456 }];
          expectedResult = service.addStoreToCollectionIfMissing(storeCollection, store);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(store);
        });

        it('should add only unique Store to an array', () => {
          const storeArray: IStore[] = [{ id: 123 }, { id: 456 }, { id: 8391 }];
          const storeCollection: IStore[] = [{ id: 123 }];
          expectedResult = service.addStoreToCollectionIfMissing(storeCollection, ...storeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const store: IStore = { id: 123 };
          const store2: IStore = { id: 456 };
          expectedResult = service.addStoreToCollectionIfMissing([], store, store2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(store);
          expect(expectedResult).toContain(store2);
        });

        it('should accept null and undefined values', () => {
          const store: IStore = { id: 123 };
          expectedResult = service.addStoreToCollectionIfMissing([], null, store, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(store);
        });

        it('should return initial array if no Store is added', () => {
          const storeCollection: IStore[] = [{ id: 123 }];
          expectedResult = service.addStoreToCollectionIfMissing(storeCollection, undefined, null);
          expect(expectedResult).toEqual(storeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
