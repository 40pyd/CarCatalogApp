using System;
using System.Collections.Generic;

namespace Domain
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateBirth { get; set; }
        public DateTime LastActive { get; set; }
        public DateTime Created { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public ICollection<Car> Cars { get; set; }
    }
}