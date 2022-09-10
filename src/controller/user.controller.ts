import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UsePipes,
  Get,
  Delete,
  Put,
  Req,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/service/user.service';
import { AuthenticationRequest } from 'src/interface/authentication.request';
import { AddTagsToUserRequest } from 'src/dto/add-tags-to-user.request.dto';
import { UpdateUserRequest } from 'src/dto/update.user.request';
import { UpdateUserValidationPipe } from 'src/validation/update-user.validation.pipe';
import { AddTagsToUserValidationPipe } from 'src/validation/add-tags-to-user.validation.pipe';

@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}
  @Get()
  async getUser(@Req() req: AuthenticationRequest, @Res() res: Response) {
    const data = await this.userService.getUserWithTags(req.user);
    res.status(HttpStatus.OK).send(data);
  }
  @Delete()
  async removeUser(@Req() req: AuthenticationRequest, @Res() res: Response) {
    await this.userService.removeUser(req.user);
    res.sendStatus(HttpStatus.OK);
  }
  @Put()
  @UsePipes(new UpdateUserValidationPipe())
  async updateUser(
    @Res() res: Response,
    @Body() body: UpdateUserRequest,
    @Req() req: AuthenticationRequest,
  ) {
    const data = await this.userService.updateUserInfo(body, req.user);
    res.status(HttpStatus.OK).send(data);
  }
  @Post('tag')
  @UsePipes(new AddTagsToUserValidationPipe())
  async addTagToUser(
    @Body() body: AddTagsToUserRequest,
    @Res() res: Response,
    @Req() req: AuthenticationRequest,
  ) {
    const data = await this.userService.addTagsToUser(req.user, body.tags);
    res.status(HttpStatus.OK).send(data);
  }
  @Delete('tag/:id')
  async removeUserTag(
    @Param() params,
    @Res() res: Response,
    @Req() req: AuthenticationRequest,
  ) {
    const { id } = req.params;
    return await this.userService.removeUserTag(req.user, id);
  }
  @Get('tag/my')
  async getUserCreatedTags(
    @Req() req: AuthenticationRequest,
    @Res() res: Response,
  ) {
    const data = await this.userService.getTagsCreatedByUser(req.user);
    res.status(HttpStatus.OK).send(data);
  }
}
