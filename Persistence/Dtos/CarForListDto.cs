using System;

namespace Persistence.Dtos
{
    public class CarForListDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string PhotoUrl { get; set; }
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string Price { get; set; }
        public int Year { get; set; }
    }
}