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
        public int HorsePowers { get; set; }
        public DateTime Manufactured { get; set; }
    }
}