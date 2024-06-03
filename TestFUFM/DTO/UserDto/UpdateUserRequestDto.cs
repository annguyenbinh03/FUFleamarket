using BusinessObjects.AddressDto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.UserDto
{
    public class UpdateUserRequestDto
    {
        [StringLength(20)]
        public string? Password { get; set; }
        [StringLength(30)]
        public string? FullName { get; set; }
        [StringLength(40)]
        public string Email { get; set; } = null!;
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        [StringLength(300)]
        public string? Introduction { get; set; }       
        [StringLength(200)]
        public string? Avarta { get; set; }


    }
}
