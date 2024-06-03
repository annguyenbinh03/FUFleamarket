using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.AccountDto
{
    public class Admin
    {
        public int UserId { get; set; }
        public string? Password { get; set; }
        public string? FullName { get; set; }
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Introduction { get; set; }
        public int RoleId { get; set; }
        
        public string? Avarta { get; set; }
    }
}
