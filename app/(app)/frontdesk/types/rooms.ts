 

export interface RoomType {
  id: string;
  number: string;
  type: 'STANDARD' | 'A_FRAMES' | 'FLOATING' | 'EXECUTIVE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  pricePerNight: string;
}