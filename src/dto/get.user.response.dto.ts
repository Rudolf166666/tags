type Tag = {
  id: string;
  name: string;
  sortOrder: number;
};
export class GetUserDto {
  email: string;
  nickname: string;
  tags: Tag[];
}
