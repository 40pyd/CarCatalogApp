using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;

namespace Persistence.Data
{
    public interface ICarRepository: IRepository
    {
        Task<Car> GetCar(int id);
        Task<IEnumerable<Car>> GetCars();
        Task<CarPhoto> GetPhoto(int id);
        Task<CarPhoto> GetMainPhoto(int userId);
    }
}