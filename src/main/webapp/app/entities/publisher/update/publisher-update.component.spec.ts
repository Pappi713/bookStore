jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PublisherService } from '../service/publisher.service';
import { IPublisher, Publisher } from '../publisher.model';

import { PublisherUpdateComponent } from './publisher-update.component';

describe('Component Tests', () => {
  describe('Publisher Management Update Component', () => {
    let comp: PublisherUpdateComponent;
    let fixture: ComponentFixture<PublisherUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let publisherService: PublisherService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PublisherUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PublisherUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PublisherUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      publisherService = TestBed.inject(PublisherService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const publisher: IPublisher = { id: 456 };

        activatedRoute.data = of({ publisher });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(publisher));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Publisher>>();
        const publisher = { id: 123 };
        jest.spyOn(publisherService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ publisher });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: publisher }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(publisherService.update).toHaveBeenCalledWith(publisher);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Publisher>>();
        const publisher = new Publisher();
        jest.spyOn(publisherService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ publisher });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: publisher }));
        saveSubject.complete();

        // THEN
        expect(publisherService.create).toHaveBeenCalledWith(publisher);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Publisher>>();
        const publisher = { id: 123 };
        jest.spyOn(publisherService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ publisher });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(publisherService.update).toHaveBeenCalledWith(publisher);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
