import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll(@Tenant() tenantId: string, @Query() pagination: PaginationQueryDto) {
    return this.documentsService.findAll(tenantId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.documentsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() body: any, @Tenant() tenantId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.documentsService.create({ ...body, tenantId, uploadedBy: user.sub });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.documentsService.remove(id, tenantId);
  }
}
