import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  findAll(@Tenant() tenantId: string, @Query() pagination: PaginationQueryDto) {
    return this.submissionsService.findAll(tenantId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.submissionsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() body: any, @Tenant() tenantId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.submissionsService.create({ ...body, tenantId, createdBy: user.sub });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Tenant() tenantId: string) {
    return this.submissionsService.update(id, tenantId, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Tenant() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.submissionsService.updateStatus(id, tenantId, status, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.submissionsService.remove(id, tenantId);
  }
}
