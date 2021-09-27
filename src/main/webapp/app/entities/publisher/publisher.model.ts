export interface IPublisher {
  id?: number;
  name?: string | null;
  location?: string | null;
}

export class Publisher implements IPublisher {
  constructor(public id?: number, public name?: string | null, public location?: string | null) {}
}

export function getPublisherIdentifier(publisher: IPublisher): number | undefined {
  return publisher.id;
}
