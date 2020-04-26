using System;
using System.Collections.Generic;
using System.Security.Claims;
using CarCatalog.API.Controllers;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Persistence.Data;
using Persistence.Dtos;
using Persistence.Helpers;
using Xunit;

namespace CarCatalogApp.Tests.UnitTests
{
    public class CarControllerTests : BaseTests
    {
        [Fact]
        public async void GetAllCars()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);

            var carParams = new CarParams()
            {
                PageNumber = 1,
                PageSize = 10
            };

            context.Cars.Add(new Car() { });
            context.Cars.Add(new Car() { });
            await context.SaveChangesAsync();

            //Act
            var testContext = BuildContext(databaseName);
            var controller = new CarsController(
                carsRepository, mapper,
                null, testContext, null);
            controller.ControllerContext.HttpContext = new DefaultHttpContext();
            var response = await controller.GetCars(carParams);
            OkObjectResult okResult = response as OkObjectResult;
            var cars = (List<CarForListDto>)okResult.Value;

            //Assert
            Assert.Equal(2, (int)cars.Count);
        }

        [Fact]
        public async void GetCar()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);
            var usersRepository = new UserRepository(context);

            var exampleCar = new Car() { ModelName = "test name" };
            var exampleUser = new User() { Cars = new List<Car>() };
            exampleUser.Cars.Add(exampleCar);

            context.Users.Add(exampleUser);
            context.Cars.Add(exampleCar);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                carsRepository, mapper,
                usersRepository, testContext, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.GetCar(1);
            OkObjectResult okResult = response as OkObjectResult;
            var car = (CarForDetailedDto)okResult.Value;

            //Assert
            Assert.Equal("test name", car.ModelName);
        }

        [Fact]
        public async void AddCarFailUnauthorized()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var carForAdd = new CarForAddDto()
            {
                ModelName = "test modelname",
                BrandName = "test brandname",
                Price = 1,
                Color = "test color",
                Year = 1990,
                Manufactured = DateTime.Now
            };

            var exampleUser = new User() { Cars = new List<Car>() };

            context.Users.Add(exampleUser);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "2")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                null, null,
                null, null, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.AddCar(1, carForAdd);
            var result = response as UnauthorizedResult;
            //Assert
            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void AddCarSuccess()
        {
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);
            var usersRepository = new UserRepository(context);
            var carForAdd = new CarForAddDto()
            {
                ModelName = "test modelname",
                BrandName = "test brandname",
                Price = 1,
                Color = "test color",
                Year = 1990,
                Manufactured = DateTime.Now
            };

            var exampleCar = new Car() { ModelName = "test name" };
            var exampleUser = new User() { Cars = new List<Car>() };
            exampleUser.Cars.Add(exampleCar);

            context.Users.Add(exampleUser);
            context.Cars.Add(exampleCar);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                carsRepository, mapper,
                usersRepository, testContext, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.AddCar(1, carForAdd);
            var result = response as OkObjectResult;
            var car = (Car)result.Value;
            //Assert
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("test modelname", car.ModelName);
        }

        [Fact]
        public async void UpdateCarFailUnauthorized()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);

            var exampleUser = new User() { Cars = new List<Car>() };

            context.Users.Add(exampleUser);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "2")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                null, null,
                null, null, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.UpdateCar(1, 1, null);
            var result = response as UnauthorizedResult;
            //Assert
            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void UpdateCarSuccess()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);
            var usersRepository = new UserRepository(context);
            var carForUpdate = new CarForUpdateDto()
            {
                ModelName = "test modelname"
            };

            var exampleCar = new Car() { ModelName = "test name" };
            var exampleUser = new User() { Cars = new List<Car>() };
            exampleUser.Cars.Add(exampleCar);

            context.Users.Add(exampleUser);
            context.Cars.Add(exampleCar);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                carsRepository, mapper,
                usersRepository, testContext, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.UpdateCar(1, 1, carForUpdate);
            var result = response as NoContentResult;
            //Assert
            Assert.Equal(204, result.StatusCode);
        }

        [Fact]
        public async void DeleteCarFailUserUnauthorized()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);

            var exampleUser = new User() { Cars = new List<Car>() };

            context.Users.Add(exampleUser);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "2")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                null, null,
                null, null, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.DeleteCar(1, 1);
            var result = response as UnauthorizedResult;
            //Assert
            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void DeleteCarFailUserUnauthorizedForCar()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);
            var usersRepository = new UserRepository(context);

            var exampleCar = new Car() { ModelName = "test name", UserId = 2 };
            var exampleUser = new User() { Cars = new List<Car>() };

            context.Users.Add(exampleUser);
            context.Cars.Add(exampleCar);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                carsRepository, mapper,
                usersRepository, testContext, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.DeleteCar(1, 1);
            var result = response as UnauthorizedResult;
            //Assert
            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void DeleteCarSuccess()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);
            var usersRepository = new UserRepository(context);
            var carForUpdate = new CarForUpdateDto()
            {
                ModelName = "test modelname"
            };

            var exampleCar = new Car() { ModelName = "test name", UserId = 1 };
            var exampleUser = new User() { Cars = new List<Car>() };
            exampleUser.Cars.Add(exampleCar);

            context.Users.Add(exampleUser);
            context.Cars.Add(exampleCar);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                carsRepository, mapper,
                usersRepository, testContext, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.DeleteCar(1, 1);
            var result = response as OkResult;
            //Assert
            Assert.Equal(200, result.StatusCode);
        }
        [Fact]
        public async void DeleteCarBadRequest()
        {
            //Arrange
            var databaseName = Guid.NewGuid().ToString();
            var context = BuildContext(databaseName);
            var mapper = BuildMap();
            var carsRepository = new CarRepository(context);
            var usersRepository = new UserRepository(context);
            var carForUpdate = new CarForUpdateDto()
            {
                ModelName = "test modelname"
            };

            var exampleCar = new Car() { ModelName = "test name", UserId = 1 };
            var exampleUser = new User() { Cars = new List<Car>() };
            exampleUser.Cars.Add(exampleCar);

            context.Users.Add(exampleUser);
            context.Cars.Add(exampleCar);
            await context.SaveChangesAsync();

            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                    new Claim(ClaimTypes.NameIdentifier, "1")
            }));

            //Act
            var testContext = BuildContext(databaseName);

            var controller = new CarsController(
                carsRepository, mapper,
                usersRepository, testContext, null);

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            var response = await controller.DeleteCar(2, 1);
            var result = response as BadRequestResult;
            //Assert
            Assert.Equal(200, result.StatusCode);
        }
    }
}