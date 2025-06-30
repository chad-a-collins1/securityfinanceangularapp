export interface OrderItemDto {
  orderItemId: number;
  itemId: number;
  quantity: number;
  name: string,
  price?: number; 
}