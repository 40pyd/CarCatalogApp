using System;
using System.ComponentModel.DataAnnotations;

namespace Persistence.Dtos
{
    public class CarForAddDto
    {
        [Required]
        public string BrandName { get; set; }

        [Required]
        public string ModelName { get; set; }

        [Required]
        public string Color { get; set; }

        [Required]
        public int Price { get; set; }
        public DateTime Created { get; set; }
        
        [Required]
        public int Year { get; set; }
        public double EnginePower { get; set; }
        public bool IsNew { get; set; }
        public string Body { get; set; }
        public string Fuel { get; set; }
        public string Transmission { get; set; }
        public string Drive { get; set; }
        public int Odometr { get; set; }
        public string Description { get; set; }

        [Required]
        public DateTime Manufactured { get; set; }

        public CarForAddDto()
        {
            Created = DateTime.Now;
        }
    }
}