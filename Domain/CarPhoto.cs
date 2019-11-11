using System;

namespace Domain
{
    public class CarPhoto: PhotoBase
    {
        public int CarId { get; set; }
        public Car Car { get; set; }
    }
}