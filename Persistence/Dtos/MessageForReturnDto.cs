using System;

namespace Persistence.Dtos
{
    public class MessageForReturnDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int CarId { get; set; }
        public string SenderKnownAs { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string Content { get; set; }
        public DateTime MessageSent { get; set; }
    }
}