import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from '../entities/college.entity';
import { CollegePlacement } from '../entities/collegePlacement.entity';
import { CollegeWiseCourse } from '../entities/collegeWiseCourse.entity';

interface AvgData {
  highest_placement: number;
  average_placement: number;
  median_placement: number;
  placement_rate: number;
  count: number;
}
@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College)
    private collegeRepository: Repository<College>,
    @InjectRepository(CollegePlacement)
    private collegePlacementRepository: Repository<CollegePlacement>,
    @InjectRepository(CollegeWiseCourse)
    private collegeWiseCourseRepository: Repository<CollegeWiseCourse>,
  ) {}

  async getCollegeData(collegeId: number) {
    const placements = await this.collegePlacementRepository.find({
      where: { college: { id: collegeId } },
      order: { year: 'ASC' },
    });
    const filteredPlacements = placements.filter((placement) => {
      return (
        placement.highest_placement > 0 &&
        placement.average_placement > 0 &&
        placement.median_placement > 0 &&
        placement.placement_rate > 0
      );
    });

    // If no valid placements are available, return empty data
    if (filteredPlacements.length === 0) {
      return {
        avg_section: [],
        placement_section: [],
      };
    }

    console.log(filteredPlacements);

    // Step 1: Calculate the average values for each year
    const avgSection: Record<string, AvgData> = filteredPlacements.reduce(
      (acc, placement) => {
        const year = placement.year;
        console.log(year);
        // Initialize the accumulator for the year if not present
        if (!acc[year]) {
          console.log('nside', year);
          acc[year] = {
            highest_placement: 0,
            average_placement: 0,
            median_placement: 0,
            placement_rate: 0,
            count: 0,
          };
        }
        acc[year].highest_placement += Number(placement.highest_placement);
        acc[year].average_placement += Number(placement.average_placement);
        acc[year].median_placement += Number(placement.median_placement);
        acc[year].placement_rate += Number(placement.placement_rate);
        acc[year].count++;
        console.log(acc, 'finish');
        return acc;
      },
      {} as Record<string, AvgData>,
    );

    console.log('abg', avgSection);
    // Calculate the averages for each year
    const avgResults = Object.entries(avgSection).map(
      ([
        year,
        {
          highest_placement,
          average_placement,
          median_placement,
          placement_rate,
          count,
        },
      ]) => ({
        year: Number(year), 
        highest_placement: highest_placement / count,
        average_placement: average_placement / count,
        median_placement: median_placement / count,
        placement_rate: placement_rate / count,
      }),
    );

    const sortedAvgResults = avgResults.sort((a, b) => a.year - b.year);

    const placementSection = sortedAvgResults.map((place, idx) => {
      let placementTrend: string | null = null;
      let prevPlacementRate: number = 0;
      let cnt: number = 0;
      if (idx > 0) {
        prevPlacementRate += sortedAvgResults[idx - 1].placement_rate;
        cnt += 1;
      }
      if (idx > 1) {
        prevPlacementRate += sortedAvgResults[idx - 2].placement_rate;
        cnt += 1;
      }
      if (prevPlacementRate != 0 && cnt != 0) {
        let prevPlacementAvg = prevPlacementRate / cnt;
        placementTrend =
          place.placement_rate > prevPlacementAvg ? 'UP' : 'DOWN';
      }

      return {
        ...place,
        placementTrend,
      };
    });

    return {
      avgSection: avgResults,
      placementSection: placementSection,
    };
  }

  async getCollegeCourses(collegeId: number) {
    return this.collegeWiseCourseRepository.find({
      where: { college: { id: collegeId } },
      order: { course_fee: 'DESC' },
    });
  }

  async filterColleges(city?: string, state?: string) {
    const query = this.collegeRepository
      .createQueryBuilder('college')
      .leftJoinAndSelect('college.city', 'city')
      .leftJoinAndSelect('college.state', 'state');

    if (city) {
      query.andWhere('city.name = :city', { city });
    }

    if (state) {
      query.andWhere('state.name = :state', { state });
    }

    return query.getMany();
  }
}
