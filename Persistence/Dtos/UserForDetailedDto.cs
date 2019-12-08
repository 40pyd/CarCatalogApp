using System;
using System.Collections.Generic;

namespace Persistence.Dtos
{
    public class UserForDetailedDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string PhotoUrl { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public ICollection<PhotoForDetailedDto> Photos { get; set; }
    }
}