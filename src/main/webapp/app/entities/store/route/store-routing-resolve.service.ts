import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStore, Store } from '../store.model';
import { StoreService } from '../service/store.service';

@Injectable({ providedIn: 'root' })
export class StoreRoutingResolveService implements Resolve<IStore> {
  constructor(protected service: StoreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStore> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((store: HttpResponse<Store>) => {
          if (store.body) {
            return of(store.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Store());
  }
}
