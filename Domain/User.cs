using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class User: IdentityUser<int>
    {
        public DateTime DateBirth { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime Created { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Car> Cars { get; set; }
        public virtual ICollection<LikedCar> LikedCars { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}