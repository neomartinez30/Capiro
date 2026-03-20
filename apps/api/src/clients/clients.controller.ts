import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll(@Tenant() tenantId: string, @Query() pagination: PaginationQueryDto) {
    return this.clientsService.findAll(tenantId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.clientsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() body: any, @Tenant() tenantId: string) {
    return this.clientsService.create({ ...body, tenantId });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Tenant() tenantId: string) {
    return this.clientsService.update(id, tenantId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.clientsService.remove(id, tenantId);
  }
}
