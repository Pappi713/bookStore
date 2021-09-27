jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IStore, Store } from '../store.model';
import { StoreService } from '../service/store.service';

import { StoreRoutingResolveService } from './store-routing-resolve.service';

describe('Service Tests', () => {
  describe('Store routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: StoreRoutingResolveService;
    let service: StoreService;
    let resultStore: IStore | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(StoreRoutingResolveService);
      service = TestBed.inject(StoreService);
      resultStore = undefined;
    });

    describe('resolve', () => {
      it('should return IStore returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultStore = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultStore).toEqual({ id: 123 });
      });

      it('should return new IStore if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultStore = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultStore).toEqual(new Store());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Store })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultStore = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultStore).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
