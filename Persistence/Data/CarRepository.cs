using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Data
{
    public class CarRepository: ICarRepository
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

        public async Task<IEnumerable<Car>> GetCars()
        {
            return await _context.Cars.Include(x => x.Photos).ToListAsync();
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}