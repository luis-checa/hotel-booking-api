export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface BookingProps {
  id: number;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  userId: number;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Booking {
  private constructor(private readonly props: BookingProps) {}

  static create(props: BookingProps): Booking {
    return new Booking(props);
  }

  get id() {
    return this.props.id;
  }

  get checkIn() {
    return this.props.checkIn;
  }

  get checkOut() {
    return this.props.checkOut;
  }

  get status() {
    return this.props.status;
  }

  get userId() {
    return this.props.userId;
  }

  get roomId() {
    return this.props.roomId;
  }

  cancel() {
    if (this.props.status === BookingStatus.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }

    this.props.status = BookingStatus.CANCELLED;
  }
}
