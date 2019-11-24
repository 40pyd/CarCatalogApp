using System;
using System.Collections.Generic;
using Domain;

namespace Persistence.Dtos
{
    public class CarForDetailedDto
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string Color { get; set; }
        public int Price { get; set; }
        public DateTime Created { get; set; }
        public int Year { get; set; }
        public double EnginePower { get; set; }
        public bool IsNew { get; set; }
        public string Body { get; set; }
        public string Fuel { get; set; }
        public string Transmission { get; set; }
        public string Drive { get; set; }
        public int Odometr { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string PhotoUrl { get; set; }
        public ICollection<PhotoForDetailedDto> Photos { get; set; }
    }
}