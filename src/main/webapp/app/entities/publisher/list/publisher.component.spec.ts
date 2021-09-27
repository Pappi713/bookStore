import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PublisherService } from '../service/publisher.service';

import { PublisherComponent } from './publisher.component';

describe('Component Tests', () => {
  describe('Publisher Management Component', () => {
    let comp: PublisherComponent;
    let fixture: ComponentFixture<PublisherComponent>;
    let service: PublisherService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PublisherComponent],
      })
        .overrideTemplate(PublisherComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PublisherComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PublisherService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.publishers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
