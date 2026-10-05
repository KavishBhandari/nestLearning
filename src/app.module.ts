import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
//import { CategoryModule } from './category/category.module';
import { CategoryModule } from './category/category.module';
import { RoleModule } from './role/role.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),//for loading env variables
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src/public'),
      serveRoot: '/public',
    }),//for serving the static files
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URL!,),
    AuthModule,
    CategoryModule,
    RoleModule,
    BrandModule,
    //CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
