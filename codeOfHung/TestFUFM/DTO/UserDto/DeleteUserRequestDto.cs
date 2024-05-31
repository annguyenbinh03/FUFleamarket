using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.UserDto
{
    public class DeleteUserRequestDto
    {
        [StringLength(20)]
        public string? Password { get; }
        [StringLength(30)]
        public string? FullName { get; }
        [StringLength(40)]
        public string Email { get; } = null!;
        [StringLength(20)]
        public string? PhoneNumber { get; }
        [StringLength(300)]
        public string? Introduction { get; }

        public int RoleId { get; } = 1;

        public bool Status { get; set; } 
        [StringLength(200)]
        public string? Avarta { get; }
    }
}
