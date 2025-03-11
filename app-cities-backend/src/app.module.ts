import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './city/city.module';
import { AppController } from './app.controller';
import { CityEntity } from './city/entity/city.entity';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql_db',
      port: parseInt(process.env.DB_PORT || '3307'),
      username: process.env.DB_USERNAME || 'developer',
      password: process.env.DB_PASSWORD || 'generic_password',
      database: process.env.DB_DATABASE || 'cities_record_db',
      entities: [CityEntity],
      autoLoadEntities: true,
      synchronize: true,
      logging: true, // Enable SQL query logging
    }),
    CityModule,
    SeedModule,
  ],
  controllers: [AppController],
})
export class AppModule { }