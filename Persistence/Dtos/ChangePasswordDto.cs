namespace Persistence.Dtos
{
    public class ChangePasswordDto
    {
        public string Id { get; set; } 
        public string Email { get; set; }
        public string OldPassword { get; set; } 
        public string NewPassword { get; set; }
    }
}