import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { TopicsModule } from './topics/topics.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { OfficesModule } from './offices/offices.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ClientsModule,
    TopicsModule,
    SubmissionsModule,
    OfficesModule,
    DocumentsModule,
  ],
})
export class AppModule {}
