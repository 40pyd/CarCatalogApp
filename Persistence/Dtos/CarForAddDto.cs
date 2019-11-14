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
        [Required]
        public int HorsePowers { get; set; }
        [Required]
        public DateTime Manufactured { get; set; }
    }
}