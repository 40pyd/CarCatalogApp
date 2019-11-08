using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence.Data;
using Persistence.Dtos;

namespace CarCatalog.API.Controllers
{
    // [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        // [HttpGet]
        // public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        // {
        //     var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        //     var userFromRepo = await _repo.GetUser(currentUserId);
        //     userParams.UserId = currentUserId;
        //     if (string.IsNullOrEmpty(userParams.Gender))
        //     {
        //         userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
        //     }
        //     var users = await _repo.GetUsers(userParams);
        //     var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
        //     Response.AddPagination(users.CurrentPage, users.PageSize,
        //         users.TotalCount, users.TotalPages);

        //     return Ok(usersToReturn);
        // }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            return Ok(userToReturn);
        }
    }
}