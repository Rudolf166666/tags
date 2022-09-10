export class GetTagsRequest {
  sort?: 'order_asc' | 'name_asc' | 'name_desc' | 'order_desc';
  page?: number;
  pageSize?: number;
}
