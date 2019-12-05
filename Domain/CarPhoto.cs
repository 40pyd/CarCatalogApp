using System;

namespace Domain
{
    public class CarPhoto: PhotoBase
    {
        public int CarId { get; set; }
        public virtual Car Car { get; set; }
    }
}