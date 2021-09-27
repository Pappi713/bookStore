import { IBook } from 'app/entities/book/book.model';

export interface IStore {
  id?: number;
  name?: string | null;
  adress?: string | null;
  books?: IBook[] | null;
}

export class Store implements IStore {
  constructor(public id?: number, public name?: string | null, public adress?: string | null, public books?: IBook[] | null) {}
}

export function getStoreIdentifier(store: IStore): number | undefined {
  return store.id;
}
