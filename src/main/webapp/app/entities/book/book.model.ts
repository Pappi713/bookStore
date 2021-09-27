import { IAuthor } from 'app/entities/author/author.model';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { IStore } from 'app/entities/store/store.model';

export interface IBook {
  id?: number;
  title?: string | null;
  pageNo?: number | null;
  author?: IAuthor | null;
  publisher?: IPublisher | null;
  stores?: IStore[] | null;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public title?: string | null,
    public pageNo?: number | null,
    public author?: IAuthor | null,
    public publisher?: IPublisher | null,
    public stores?: IStore[] | null
  ) {}
}

export function getBookIdentifier(book: IBook): number | undefined {
  return book.id;
}
