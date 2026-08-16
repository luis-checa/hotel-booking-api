export interface HotelProps {
  id: number;
  name: string;
  address: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Hotel {
  private constructor(private readonly props: HotelProps) {}

  static create(props: HotelProps): Hotel {
    return new Hotel(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get address() {
    return this.props.address;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  update(props: Partial<Omit<HotelProps, 'id' | 'createdAt'>>) {
    Object.assign(this.props, props);
  }
}
