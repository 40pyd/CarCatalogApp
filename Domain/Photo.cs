using System;

namespace Domain
{
    public class Photo: PhotoBase
    {
        public int UserId { get; set; }
        public User User { get; set; }
    }
}