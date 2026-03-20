import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { Tenant } from '../auth/decorators/tenant.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Tenant() tenantId: string) {
    return this.usersService.findByTenant(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.usersService.findOne(id, tenantId);
  }
}
