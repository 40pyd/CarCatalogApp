using System;

namespace Persistence.Dtos
{
    public class CarForUpdateDto
    {
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string Color { get; set; }
        public int Price { get; set; }
        public int Year { get; set; }
        public double EnginePower { get; set; }
        public bool IsNew { get; set; }
        public string Body { get; set; }
        public string Fuel { get; set; }
        public string Transmission { get; set; }
        public string Drive { get; set; }
        public int Odometr { get; set; }
        public string Description { get; set; }
    }
}