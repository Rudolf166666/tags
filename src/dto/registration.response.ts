export class RegistrationResDto {
  token: string;
  expire: number;
  constructor(token: string, expire: number) {
    this.expire = expire;
    this.token = token;
  }
}
