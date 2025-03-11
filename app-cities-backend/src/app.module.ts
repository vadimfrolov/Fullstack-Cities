import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModule } from './city/city.module';
import { AppController } from './app.controller';
import { CityEntity } from './city/entity/city.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3307,
      username: 'developer',
      password: 'generic_password',
      database: 'cities_record_db',
      entities: [CityEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
    CityModule,
  ],
  controllers: [AppController],
})
export class AppModule { }