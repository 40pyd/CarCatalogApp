using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CarCatalog.API.Helpers;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Domain;
using Microsoft.AspNetCore.Mvc;
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
        public CarsController(ICarRepository repo, IMapper mapper, IUserRepository userRepo, IOptions<CloudinarySettings> cloudinaryConfig)
        {
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
            var car = await _repo.GetCar(id);
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

            var carFromRepo = await _repo.GetCar(id);
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

            var user = await _userRepo.GetUser(userId);

            var carFromRepo = await _repo.GetCar(id);

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
    }
}