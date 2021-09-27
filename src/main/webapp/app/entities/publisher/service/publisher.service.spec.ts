import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPublisher, Publisher } from '../publisher.model';

import { PublisherService } from './publisher.service';

describe('Service Tests', () => {
  describe('Publisher Service', () => {
    let service: PublisherService;
    let httpMock: HttpTestingController;
    let elemDefault: IPublisher;
    let expectedResult: IPublisher | IPublisher[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PublisherService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        location: 'AAAAAAA',
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

      it('should create a Publisher', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Publisher()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Publisher', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            location: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Publisher', () => {
        const patchObject = Object.assign({}, new Publisher());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Publisher', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            location: 'BBBBBB',
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

      it('should delete a Publisher', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPublisherToCollectionIfMissing', () => {
        it('should add a Publisher to an empty array', () => {
          const publisher: IPublisher = { id: 123 };
          expectedResult = service.addPublisherToCollectionIfMissing([], publisher);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(publisher);
        });

        it('should not add a Publisher to an array that contains it', () => {
          const publisher: IPublisher = { id: 123 };
          const publisherCollection: IPublisher[] = [
            {
              ...publisher,
            },
            { id: 456 },
          ];
          expectedResult = service.addPublisherToCollectionIfMissing(publisherCollection, publisher);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Publisher to an array that doesn't contain it", () => {
          const publisher: IPublisher = { id: 123 };
          const publisherCollection: IPublisher[] = [{ id: 456 }];
          expectedResult = service.addPublisherToCollectionIfMissing(publisherCollection, publisher);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(publisher);
        });

        it('should add only unique Publisher to an array', () => {
          const publisherArray: IPublisher[] = [{ id: 123 }, { id: 456 }, { id: 12045 }];
          const publisherCollection: IPublisher[] = [{ id: 123 }];
          expectedResult = service.addPublisherToCollectionIfMissing(publisherCollection, ...publisherArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const publisher: IPublisher = { id: 123 };
          const publisher2: IPublisher = { id: 456 };
          expectedResult = service.addPublisherToCollectionIfMissing([], publisher, publisher2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(publisher);
          expect(expectedResult).toContain(publisher2);
        });

        it('should accept null and undefined values', () => {
          const publisher: IPublisher = { id: 123 };
          expectedResult = service.addPublisherToCollectionIfMissing([], null, publisher, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(publisher);
        });

        it('should return initial array if no Publisher is added', () => {
          const publisherCollection: IPublisher[] = [{ id: 123 }];
          expectedResult = service.addPublisherToCollectionIfMissing(publisherCollection, undefined, null);
          expect(expectedResult).toEqual(publisherCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
