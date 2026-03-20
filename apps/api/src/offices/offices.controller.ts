import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { OfficesService } from './offices.service';

@Controller('offices')
@UseGuards(AuthGuard('jwt'))
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.officesService.findAll(pagination);
  }

  @Get('search')
  search(@Query('q') query: string, @Query() pagination: PaginationQueryDto) {
    return this.officesService.search(query, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.officesService.findOne(id);
  }
}
