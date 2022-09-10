import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UsePipes,
  Delete,
  Param,
  Req,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { TagService } from 'src/service/tag.service';
import { AuthenticationRequest } from 'src/interface/authentication.request';
import { CreateTagRequest } from 'src/dto/create-tag.request.dto';
import { UpdateTagRequest } from 'src/dto/update-tag-requesr.dto';
import { CreateTagValidationPipe } from 'src/validation/create-tag.validation.pipe';
import { GetTagsRequest } from 'src/dto/get-tags.request';
import { GetTagValidationPipe } from 'src/validation/get-tags.validation.pipe';
import { UpdateTagValidationPipe } from 'src/validation/update-tag.validation.pipe';

@Controller('tag')
export class TagController {
  constructor(readonly tagService: TagService) {}

  @Get()
  @UsePipes(new GetTagValidationPipe())
  async getTags(
    @Query() queries: GetTagsRequest,
    @Res() res: Response,
    @Req() req: AuthenticationRequest,
  ) {
    const { page = 1, pageSize = 12, sort = 'name_asc' } = queries;
    const data = await this.tagService.getTags(page, pageSize, sort);
    res.status(HttpStatus.OK).send(data);
  }
  @Post()
  @UsePipes(new CreateTagValidationPipe())
  async createTag(
    @Body() body: CreateTagRequest,
    @Res() res: Response,
    @Req() req: AuthenticationRequest,
  ) {
    const data = await this.tagService.createTag(req.user, body);
    res.status(HttpStatus.CREATED).send(data);
  }
  @Put(':id')
  async updateTag(
    @Res() res: Response,
    @Req() req: AuthenticationRequest,
    @Param() params,
    @Body(new UpdateTagValidationPipe()) body: UpdateTagRequest,
  ) {
    const data = await this.tagService.updateTag(req.user, body, params.id);
    res.status(HttpStatus.OK).send(data);
  }
  @Get(':id')
  async getTag(@Param() params, @Res() res: Response) {
    const data = await this.tagService.getTag(params.id);
    res.status(HttpStatus.OK).send(data);
  }
  @Delete(':id')
  deleteTag(
    @Param() params,
    @Res() res: Response,
    @Req() req: AuthenticationRequest,
  ) {
    return this.tagService.removeTag(req.user, params.id);
  }
}
