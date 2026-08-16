export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SUITE = 'SUITE',
}

export interface RoomProps {
  id: number;
  number: string;
  type: RoomType;
  price: number;
  capacity: number;
  hotelId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Room {
  private constructor(private readonly props: RoomProps) {}

  static create(props: RoomProps): Room {
    return new Room(props);
  }

  get id() {
    return this.props.id;
  }

  get number() {
    return this.props.number;
  }

  get type() {
    return this.props.type;
  }

  get price() {
    return this.props.price;
  }

  get capacity() {
    return this.props.capacity;
  }

  get hotelId() {
    return this.props.hotelId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  update(props: Partial<Omit<RoomProps, 'id' | 'hotelId' | 'createdAt'>>) {
    Object.assign(this.props, props);
  }
}
