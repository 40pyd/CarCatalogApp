using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;

namespace Persistence.Data
{
    public interface IUserRepository: IRepository
    {
        Task<User> GetUser(int id);
        Task<IEnumerable<User>> GetUsers();
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhoto(int userId);
    }
}