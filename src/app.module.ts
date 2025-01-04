import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { College } from './entities/college.entity';
import { CollegePlacement } from './entities/collegePlacement.entity';
import { CollegeWiseCourse } from './entities/collegeWiseCourse.entity';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { CollegesController } from './college/college.controller';
import { CollegesService } from './college/college.service';
import { User } from './entities/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', 
      
      url:process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, 
      },
    
      entities: [
        College,
        CollegePlacement,
        CollegeWiseCourse,
        City,
        State,
        User,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      College,
      CollegePlacement,
      CollegeWiseCourse,
      City,
      State,
      User,
    ]),
  ],
  controllers: [AppController, CollegesController, AuthController],
  providers: [AppService, CollegesService, AuthService],
})
export class AppModule {
  static configureSwagger(app): void {
    const config = new DocumentBuilder()
      .setTitle('College Data API')
      .setDescription('API documentation for managing college-related data')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
