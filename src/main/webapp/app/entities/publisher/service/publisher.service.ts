import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPublisher, getPublisherIdentifier } from '../publisher.model';

export type EntityResponseType = HttpResponse<IPublisher>;
export type EntityArrayResponseType = HttpResponse<IPublisher[]>;

@Injectable({ providedIn: 'root' })
export class PublisherService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/publishers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(publisher: IPublisher): Observable<EntityResponseType> {
    return this.http.post<IPublisher>(this.resourceUrl, publisher, { observe: 'response' });
  }

  update(publisher: IPublisher): Observable<EntityResponseType> {
    return this.http.put<IPublisher>(`${this.resourceUrl}/${getPublisherIdentifier(publisher) as number}`, publisher, {
      observe: 'response',
    });
  }

  partialUpdate(publisher: IPublisher): Observable<EntityResponseType> {
    return this.http.patch<IPublisher>(`${this.resourceUrl}/${getPublisherIdentifier(publisher) as number}`, publisher, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPublisher>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPublisher[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPublisherToCollectionIfMissing(
    publisherCollection: IPublisher[],
    ...publishersToCheck: (IPublisher | null | undefined)[]
  ): IPublisher[] {
    const publishers: IPublisher[] = publishersToCheck.filter(isPresent);
    if (publishers.length > 0) {
      const publisherCollectionIdentifiers = publisherCollection.map(publisherItem => getPublisherIdentifier(publisherItem)!);
      const publishersToAdd = publishers.filter(publisherItem => {
        const publisherIdentifier = getPublisherIdentifier(publisherItem);
        if (publisherIdentifier == null || publisherCollectionIdentifiers.includes(publisherIdentifier)) {
          return false;
        }
        publisherCollectionIdentifiers.push(publisherIdentifier);
        return true;
      });
      return [...publishersToAdd, ...publisherCollection];
    }
    return publisherCollection;
  }
}
