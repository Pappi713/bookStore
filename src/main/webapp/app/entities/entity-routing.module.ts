import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'book',
        data: { pageTitle: 'Books' },
        loadChildren: () => import('./book/book.module').then(m => m.BookModule),
      },
      {
        path: 'author',
        data: { pageTitle: 'Authors' },
        loadChildren: () => import('./author/author.module').then(m => m.AuthorModule),
      },
      {
        path: 'store',
        data: { pageTitle: 'Stores' },
        loadChildren: () => import('./store/store.module').then(m => m.StoreModule),
      },
      {
        path: 'publisher',
        data: { pageTitle: 'Publishers' },
        loadChildren: () => import('./publisher/publisher.module').then(m => m.PublisherModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
