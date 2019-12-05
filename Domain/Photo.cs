using System;

namespace Domain
{
    public class Photo: PhotoBase
    {
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}