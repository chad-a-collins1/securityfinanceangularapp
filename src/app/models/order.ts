export interface OrderItemDto {
  orderItemId: number;
  itemId: number;
  quantity: number;
  name: string;
  price?: number;
}

export interface Order {
  id: number;
  customerId: number;
  orderItems?: OrderItemDto[];
  customerFirstName?: string;
  etag?: string;
}