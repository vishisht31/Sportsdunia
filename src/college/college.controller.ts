import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CollegesService } from './college.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Colleges')
@ApiBearerAuth()
@Controller('colleges')
@UseGuards(AuthGuard)
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get('college_data/:college_id')
  @ApiParam({
    name: 'college_id',
    description: 'The ID of the college',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Average and placement data for the college.',
  })
  getCollegeData(@Param('college_id') collegeId: string) {
    return this.collegesService.getCollegeData(Number(collegeId));
  }

  @Get('college_courses/:college_id')
  @ApiParam({
    name: 'college_id',
    description: 'The ID of the college',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of courses offered by the college sorted by course fee.',
  })
  getCollegeCourses(@Param('college_id') collegeId: string) {
    return this.collegesService.getCollegeCourses(Number(collegeId));
  }

  @Get()
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filter colleges by city name',
    example: 'New York',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    description: 'Filter colleges by state name',
    example: 'California',
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered list of colleges based on city or state.',
  })
  filterColleges(@Query('city') city: string, @Query('state') state: string) {
    return this.collegesService.filterColleges(city, state);
  }
}
