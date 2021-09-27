import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StoreService } from '../service/store.service';

import { StoreComponent } from './store.component';

describe('Component Tests', () => {
  describe('Store Management Component', () => {
    let comp: StoreComponent;
    let fixture: ComponentFixture<StoreComponent>;
    let service: StoreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StoreComponent],
      })
        .overrideTemplate(StoreComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StoreComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StoreService);

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
      expect(comp.stores?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
