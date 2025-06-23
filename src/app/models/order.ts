export interface OrderItemDto {
  itemId: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerId: number;
  orderItems?: OrderItemDto[];
  customerFirstName?: string;
}