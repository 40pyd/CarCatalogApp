using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Persistence.Helpers;

namespace Persistence.Data
{
    public class CarRepository : ICarRepository
    {
        private readonly DataContext _context;
        public CarRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<CarPhoto> GetMainPhoto(int carId)
        {
            return await _context.CarPhotos.Where(u => u.CarId == carId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<CarPhoto> GetPhoto(int id)
        {
            var photo = await _context.CarPhotos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<Car> GetCar(int id)
        {
            var car = await _context.Cars.Include(x => x.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return car;
        }

        public async Task<PagedList<Car>> GetCars(CarParams carParams)
        {
            System.Console.WriteLine(carParams.MinPrice);
            System.Console.WriteLine(carParams.MaxPrice);
            System.Console.WriteLine(carParams.MinYear);
            System.Console.WriteLine(carParams.MaxYear);
            System.Console.WriteLine(carParams.Color);
            System.Console.WriteLine(carParams.EnginePower);
            System.Console.WriteLine(carParams.IsNew);
            System.Console.WriteLine(carParams.Odometr);
            System.Console.WriteLine(carParams.OrderBy);
            System.Console.WriteLine(carParams.Fuel);
            System.Console.WriteLine(carParams.OrderBy);
            System.Console.WriteLine(carParams.Transmission);
            System.Console.WriteLine();
            System.Console.WriteLine();
            System.Console.WriteLine();
            var cars = _context.Cars.Include(x => x.Photos).OrderByDescending(c => c.Price).AsQueryable();

            var predicate = PredicateBuilder.New<Car>(true);
            if (!string.IsNullOrEmpty(carParams.ModelName))
                predicate = predicate.And(c => c.ModelName == carParams.ModelName);
            if (!string.IsNullOrEmpty(carParams.BrandName))
                predicate = predicate.And(c => c.BrandName == carParams.BrandName);
            if (carParams.EnginePower != 0)
                predicate = predicate.And(c => c.EnginePower == carParams.EnginePower);
            if (carParams.Odometr != 0)
                predicate = predicate.And(c => c.Odometr == carParams.Odometr);
            if (!string.IsNullOrEmpty(carParams.Fuel))
                predicate = predicate.And(c => c.Fuel == carParams.Fuel);
            if (!string.IsNullOrEmpty(carParams.Body))
                predicate = predicate.And(c => c.Body == carParams.Body);
            if (!string.IsNullOrEmpty(carParams.Transmission))
                predicate = predicate.And(c => c.Transmission == carParams.Transmission);
            if (!string.IsNullOrEmpty(carParams.Color))
                predicate = predicate.And(c => c.Color == carParams.Color);
            if (!string.IsNullOrEmpty(carParams.Drive))
                predicate = predicate.And(c => c.Drive == carParams.Drive);
            if (carParams.MinYear != 1900)
                predicate = predicate.And(c => c.Year >= carParams.MinYear);
            if (carParams.MaxYear != DateTime.Now.Year)
                predicate = predicate.And(c => c.Year <= carParams.MaxYear);
            if (carParams.MinPrice != 0)
                predicate = predicate.And(c => c.Price >= carParams.MinPrice);
            if (carParams.MaxPrice != 10000000)
                predicate = predicate.And(c => c.Price <= carParams.MaxPrice);

            if (!string.IsNullOrEmpty(carParams.OrderBy))
            {
                switch (carParams.OrderBy)
                {
                    case "low":
                        cars = cars.OrderByDescending(u => u.Price);
                        break;
                    default:
                        cars = cars.OrderBy(u => u.Price);
                        break;
                }
            }

            if (!string.IsNullOrEmpty(carParams.IsNew))
            {
                switch (carParams.IsNew)
                {
                    case "used":
                        predicate = predicate.And(c => c.IsNew == true);
                        break;
                    case "new":
                        predicate = predicate.And(c => c.IsNew == false);
                        break;
                    default:
                        break;
                }
            }

            cars = cars.Where(predicate).Select(c => c);

            return await PagedList<Car>.CreateAsync(cars, carParams.PageNumber, carParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}