import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UsePipes,
  Req,
} from '@nestjs/common';
import { RegistrationReqDto } from 'src/dto/registration.request.dto';
import { Response } from 'express';
import { LoginValidationPipe } from 'src/validation/login.validation.pipe';
import { RegistrationValidationPipe } from 'src/validation/registration.validation.pipe';
import { AuthService } from 'src/service/auth.service';
import { LoginReqDto } from 'src/dto/login.request.dto';
import { AuthenticationRequest } from 'src/interface/authentication.request';

@Controller()
export class AuthController {
  constructor(readonly authService: AuthService) {}
  @Post('login')
  @UsePipes(new LoginValidationPipe())
  async login(@Res() res: Response, @Body() body: LoginReqDto) {
    const data = await this.authService.login(body.email, body.password);
    return res.status(HttpStatus.OK).send(data);
  }
  @Post('signin')
  @UsePipes(new RegistrationValidationPipe())
  async registration(@Body() body: RegistrationReqDto, @Res() res: Response) {
    const data = await this.authService.registration(
      body.email,
      body.password,
      body.nickname,
    );
    return res.status(HttpStatus.CREATED).send(data);
  }
  @Post('logout')
  async logout(@Res() res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }
  @Post('refresh')
  async refresh(@Req() req: AuthenticationRequest, @Res() res: Response) {
    const data = await this.authService.refresh(req.user);
    return res.status(HttpStatus.OK).send(data);
  }
}
