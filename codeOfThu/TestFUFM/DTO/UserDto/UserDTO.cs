using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.AddressDto;

namespace DTO.UserDto
{
    public class UserDTO
    {
        public int UserId { get; set; }

        public string? Password { get; set; }

        public string? FullName { get; set; }

        public string Email { get; set; } = null!;

        public string? PhoneNumber { get; set; }

        public string? Introduction { get; set; }

        public int RoleId { get; set; }

        public bool Status { get; set; }

        public string? Avarta { get; set; }

        public List<AddressDTO>? Addresses { get; set; }
       
    }
}
