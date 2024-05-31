using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.UserDto
{
   public class UpdateUserRequestDto
    {
        public string? Password { get; set; } = string.Empty;

        public string? FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; } = string.Empty;

        public string? Introduction { get; set; } = string.Empty;

        public string? Avarta { get; set; }
    }
}
