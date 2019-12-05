namespace Domain
{
    public class LikedCar
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public int CarId { get; set; }
        public virtual Car Car { get; set; }
    }
}