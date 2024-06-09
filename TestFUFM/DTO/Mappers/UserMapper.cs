using BusinessObjects.Models;
using BusinessObjects.UserDto;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class UserMapper
    {
        public static UserDTO ToUserDTO(this BusinessObjects.Models.User model)
        {
            return new UserDTO
            {
                UserId = model.UserId,
                Password = model.Password,
                FullName = model.FullName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Introduction = model.Introduction,
                RoleId = model.RoleId,
                IsDeleted = model.IsDeleted,
                Avarta = model.Avarta,
                Addresses = model.Addresses.Select(x=> x.ToAddressDTO()).ToList(),
            };
        }
        public static User ToUserFromCreateDTO(this CreateUserRequestDto userDto)
        {
            return new User
            {                
                Password = userDto.Password,
                FullName = userDto.FullName,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                Introduction = userDto.Introduction,         
                Avarta = userDto.Avarta,
            };
        }
        public static ProfileUserDTO ToProfileUserDTO(this User model)
        {
            
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model), "User model cannot be null.");
            }

           
            return new ProfileUserDTO
            {
                FullName = model.FullName ?? "No Full Name Provided", 
                PhoneNumber = model.PhoneNumber ?? "No Phone Number Provided", 
                Avarta = model.Avarta ?? "No Avatar Provided" 
            };
        }

    }
}
