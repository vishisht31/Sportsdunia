import { DataSource } from 'typeorm';
import { City } from './src/entities/city.entity';
import { State } from './src/entities/state.entity';
import { College } from './src/entities/college.entity';
import { CollegeWiseCourse } from './src/entities/collegeWiseCourse.entity';
import { CollegePlacement } from './src/entities/collegePlacement.entity';
import { User } from './src/entities/user.entity';
import { faker } from '@faker-js/faker';

const states = [
  "Uttar Pradesh", "Maharashtra", "Tamil Nadu", "Karnataka", "West Bengal", "Gujarat", "Rajasthan", "Andhra Pradesh", "Madhya Pradesh", "Bihar"
];

const cities = {
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Ghaziabad"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Asansol", "Durgapur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kakinada"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Munger"]
};

const collegeNames = [
  "Indian Institute of Technology (IIT) Delhi", "Indian Institute of Technology (IIT) Bombay", "Indian Institute of Management (IIM) Ahmedabad",
  "National Institute of Technology (NIT) Trichy", "BITS Pilani", "VIT University", "SRM Institute of Science and Technology", "University of Delhi"
];

const courses = [
  "Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "MBA", "B.Tech in Electronics",
  "B.Sc in Physics", "B.A. in English", "B.Com", "M.Sc in Data Science"
];

const placementRates = [
  { year: 2020, rate: 85 }, { year: 2021, rate: 90 }, { year: 2022, rate: 92 }, { year: 2023, rate: 94 }
];

const dataSource = new DataSource({
  type: 'postgres',
  url:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
  entities: [City, State, College, CollegeWiseCourse, CollegePlacement, User],
  synchronize: true,

});

async function seedDatabase() {
  await dataSource.initialize();

  const stateCount = states.length;
  const cityCount = Object.values(cities).flat().length;
  const collegeCount = 100;
  const placementCount = 500; 
  const courseCount = 1000; 
  const userCount = 500; 

  const createdStates: State[] = [];
  const createdCities: City[] = [];
  const createdColleges: College[] = [];

  console.log('Seeding States and Cities...');
  for (let i = 0; i < stateCount; i++) {
    const state = await dataSource.getRepository(State).save({
      name: states[i],
    });
    createdStates.push(state);
    const stateCities = cities[states[i]];
    for (let cityName of stateCities) {
      const city = await dataSource.getRepository(City).save({
        name: cityName,
      });
      createdCities.push(city);
    }
  }

  console.log('Seeding Colleges...');
  for (let i = 0; i < collegeCount; i++) {
    const state = createdStates[faker.number.int({ min: 0, max: stateCount - 1 })];
    const city = createdCities[faker.number.int({ min: 0, max: cities[state.name].length - 1 })];
    const college = await dataSource.getRepository(College).save({
      name: collegeNames[faker.number.int({ min: 0, max: collegeNames.length - 1 })],
      score: faker.number.int({ min: 600, max: 1000 }), // Realistic college score range
      city: city,
      state: state,
    });
    createdColleges.push(college);
  }

  console.log('Seeding College Placements...');
  for (let i = 0; i < placementCount; i++) {
    const college = createdColleges[faker.number.int({ min: 0, max: collegeCount - 1 })];
    const year = faker.number.int({ min: 2020, max: 2023 });
    const placementRate = placementRates.find(rate => rate.year === year)?.rate || 85;
    await dataSource.getRepository(CollegePlacement).save({
      college: college,
      year: year,
      highest_placement: faker.number.int({ min: 500000, max: 5000000 }),
      average_placement: faker.number.int({ min: 300000, max: 3000000 }),
      median_placement: faker.number.int({ min: 250000, max: 2500000 }),
      placement_rate: placementRate,
    });
  }

  console.log('Seeding College Courses...');
  for (let i = 0; i < courseCount; i++) {
    const college = createdColleges[faker.number.int({ min: 0, max: collegeCount - 1 })];
    await dataSource.getRepository(CollegeWiseCourse).save({
      college: college,
      course_name: courses[faker.number.int({ min: 0, max: courses.length - 1 })],
      course_duration: faker.number.int({ min: 3, max: 5 }), 
      course_fee: faker.number.int({ min: 50000, max: 2000000 }),
    });
  }

  console.log('Seeding Users...');

  for (let i = 0; i < userCount; i++) {
    await dataSource.getRepository(User).save({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }

  console.log('Seeding Complete!');
  await dataSource.destroy();
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
});
