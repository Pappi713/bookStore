import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStore, getStoreIdentifier } from '../store.model';

export type EntityResponseType = HttpResponse<IStore>;
export type EntityArrayResponseType = HttpResponse<IStore[]>;

@Injectable({ providedIn: 'root' })
export class StoreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stores');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(store: IStore): Observable<EntityResponseType> {
    return this.http.post<IStore>(this.resourceUrl, store, { observe: 'response' });
  }

  update(store: IStore): Observable<EntityResponseType> {
    return this.http.put<IStore>(`${this.resourceUrl}/${getStoreIdentifier(store) as number}`, store, { observe: 'response' });
  }

  partialUpdate(store: IStore): Observable<EntityResponseType> {
    return this.http.patch<IStore>(`${this.resourceUrl}/${getStoreIdentifier(store) as number}`, store, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStoreToCollectionIfMissing(storeCollection: IStore[], ...storesToCheck: (IStore | null | undefined)[]): IStore[] {
    const stores: IStore[] = storesToCheck.filter(isPresent);
    if (stores.length > 0) {
      const storeCollectionIdentifiers = storeCollection.map(storeItem => getStoreIdentifier(storeItem)!);
      const storesToAdd = stores.filter(storeItem => {
        const storeIdentifier = getStoreIdentifier(storeItem);
        if (storeIdentifier == null || storeCollectionIdentifiers.includes(storeIdentifier)) {
          return false;
        }
        storeCollectionIdentifiers.push(storeIdentifier);
        return true;
      });
      return [...storesToAdd, ...storeCollection];
    }
    return storeCollection;
  }
}
