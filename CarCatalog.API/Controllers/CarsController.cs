using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CarCatalog.API.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Persistence.Data;
using Persistence.Dtos;
using Persistence.Helpers;

namespace CarCatalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICarRepository _repo;
        private readonly IUserRepository _userRepo;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        private readonly DataContext _context;
        public CarsController(ICarRepository repo, IMapper mapper, IUserRepository userRepo, DataContext context, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _context = context;
            _cloudinaryConfig = cloudinaryConfig;
            _userRepo = userRepo;
            _repo = repo;
            _mapper = mapper;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet]
        public async Task<IActionResult> GetCars([FromQuery]CarParams carParams)
        {
            var cars = await _repo.GetCars(carParams);
            var carsToReturn = _mapper.Map<List<CarForListDto>>(cars);

            Response.AddPagination(cars.CurrentPage, cars.PageSize,
                cars.TotalCount, cars.TotalPages);

            return Ok(carsToReturn);
        }

        [HttpGet("{id}", Name = "GetCar")]
        public async Task<IActionResult> GetCar(int id)
        {
            var isCurrent = false;
            var user = await _userRepo.GetUser(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value), true);
            if (user.Cars.Any(x => x.Id == id))
                isCurrent = true;

            var car = await _repo.GetCar(id, isCurrent);
            var carToReturn = _mapper.Map<CarForDetailedDto>(car);

            return Ok(carToReturn);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> AddCar(int id, CarForAddDto carForAddDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var carToAdd = _mapper.Map<Car>(carForAddDto);
            carToAdd.UserId = id;
            carToAdd.Created = DateTime.Now;

            _repo.Add(carToAdd);

            if (await _repo.SaveAll())
                return Ok(carToAdd);

            throw new Exception($"Adding car failed");
        }

        [HttpPut("{userId}/{id}")]
        public async Task<IActionResult> UpdateCar(int userId, int id,
            CarForUpdateDto carForUpdateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var carFromRepo = await _repo.GetCar(id, true);
            _mapper.Map(carForUpdateDto, carFromRepo);
            carFromRepo.Created = DateTime.Now;

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating car {id} failed on save");
        }

        [HttpDelete("{userId}/{id}")]
        public async Task<IActionResult> DeleteCar(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _userRepo.GetUser(userId, true);

            var carFromRepo = await _repo.GetCar(id, true);

            if (carFromRepo.UserId != userId)
                return Unauthorized();

            if (carFromRepo.Photos.Count > 0)
            {
                foreach (var photo in carFromRepo.Photos)
                {
                    if (photo.PublicId != null)
                    {
                        var deleteParams = new DeletionParams(photo.PublicId);

                        var result = _cloudinary.Destroy(deleteParams);

                        if (result.Result == "ok")
                        {
                            _repo.Delete(photo);
                        }
                    }
                    else
                    {
                        _repo.Delete(photo);
                    }
                }
            }

            _repo.Delete(carFromRepo);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the car");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> AdminDeleteCar(int id)
        {
            var carFromRepo = await _repo.GetCar(id, true);

            if (carFromRepo.Photos.Count > 0)
            {
                foreach (var photo in carFromRepo.Photos)
                {
                    if (photo.PublicId != null)
                    {
                        var deleteParams = new DeletionParams(photo.PublicId);

                        var result = _cloudinary.Destroy(deleteParams);

                        if (result.Result == "ok")
                        {
                            _repo.Delete(photo);
                        }
                    }
                    else
                    {
                        _repo.Delete(photo);
                    }
                }
            }

            _repo.Delete(carFromRepo);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the car");
        }

        [HttpPost("{userId}/like/{carId}")]
        public async Task<IActionResult> LikeCar(int userId, int carId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var like = await _repo.GetLike(userId, carId);

            if (like != null)
                return BadRequest("You already liked this car!");

            if (await _repo.GetCar(carId, false) == null)
                return NotFound();

            like = new LikedCar
            {
                UserId = userId,
                CarId = carId
            };

            _repo.Add<LikedCar>(like);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to like the car!");
        }

        [HttpDelete("{userId}/like/{id}")]
        public async Task<IActionResult> DeleteLikedCar(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _userRepo.GetUser(userId, true);

            var likedCarFromRepo = await _repo.GetLike(userId, id);

            if (likedCarFromRepo == null)
                return NotFound();

            if (likedCarFromRepo.UserId != userId)
                return Unauthorized();

            _repo.Delete(likedCarFromRepo);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the car");
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("carPhotosForModeration")]
        public async Task<IActionResult> GetCarPhotosForModeration()
        {
            var photos = await _context.CarPhotos
                .IgnoreQueryFilters()
                .Where(p => p.IsApproved == false)
                .Select(u => new
                {
                    Id = u.Id,
                    ModelName = u.Car.ModelName,
                    Url = u.Url,
                    IsApproved = u.IsApproved
                }).ToListAsync();

            return Ok(photos);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approvePhoto/{photoId}")]
        public async Task<IActionResult> ApprovePhoto(int photoId)
        {
            var photo = await _context.CarPhotos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == photoId);

            photo.IsApproved = true;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("rejectPhoto/{photoId}")]
        public async Task<IActionResult> RejectPhoto(int photoId)
        {
            var photo = await _context.CarPhotos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == photoId);

            if (photo.IsMain)
                return BadRequest("You cannot reject main photo");

            if (photo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    _context.CarPhotos.Remove(photo);
                }
            }

            if (photo.PublicId == null)
            {
                _context.CarPhotos.Remove(photo);
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}