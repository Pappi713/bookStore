jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPublisher, Publisher } from '../publisher.model';
import { PublisherService } from '../service/publisher.service';

import { PublisherRoutingResolveService } from './publisher-routing-resolve.service';

describe('Service Tests', () => {
  describe('Publisher routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PublisherRoutingResolveService;
    let service: PublisherService;
    let resultPublisher: IPublisher | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PublisherRoutingResolveService);
      service = TestBed.inject(PublisherService);
      resultPublisher = undefined;
    });

    describe('resolve', () => {
      it('should return IPublisher returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPublisher = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPublisher).toEqual({ id: 123 });
      });

      it('should return new IPublisher if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPublisher = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPublisher).toEqual(new Publisher());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Publisher })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPublisher = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPublisher).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
