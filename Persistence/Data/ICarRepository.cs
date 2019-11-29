using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Persistence.Helpers;

namespace Persistence.Data
{
    public interface ICarRepository: IRepository
    {
        Task<Car> GetCar(int id);
        Task<PagedList<Car>> GetCars(CarParams carParams);
        Task<CarPhoto> GetPhoto(int id);
        Task<CarPhoto> GetMainPhoto(int userId);
        Task<Message> GetMessage(int id);
        Task<IEnumerable<Message>> GetMessages(int carId);
    }
}