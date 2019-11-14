using System;
using System.Collections.Generic;

namespace Domain
{
    public class Car 
    {
        public int Id { get; set; } 
        public string BrandName { get; set; }
        public string ModelName { get; set; }
        public string Color { get; set; }
        public int Price { get; set; }
        public int HorsePowers { get; set; }
        public DateTime Created { get; set; }
        public DateTime Manufactured { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public ICollection<CarPhoto> Photos { get; set; }
    }
}