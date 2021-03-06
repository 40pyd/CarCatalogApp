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
        public virtual User User { get; set; }
        public virtual ICollection<CarPhoto> Photos { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
    }
}