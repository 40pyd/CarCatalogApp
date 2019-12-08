using System;

namespace Persistence.Dtos
{
    public class UserForListDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string PhotoUrl { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}