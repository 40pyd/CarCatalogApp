using System;

namespace Persistence.Dtos
{
    public class CarForUpdateDto
    {
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string Color { get; set; }
        public int Price { get; set; }
        public int HorsePowers { get; set; }
        public DateTime Manufactured { get; set; }
    }
}