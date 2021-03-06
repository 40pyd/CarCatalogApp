using System;

namespace Domain
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public virtual User Sender { get; set; }
        public int CarId { get; set; }
        public virtual Car Car { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }
    }
}