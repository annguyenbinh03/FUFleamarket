using BusinessObjects.Models;
using DTO.UserDto;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Mappers
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
                
                Avarta = model.Avarta,
                Addresses = model.Addresses.Select(x=> x.ToAddressDTO()).ToList(),
            };
        }
        public static User ToCreateUserDTO(this CreateUserRequestDto createUser)
        {
            return new User
            {
                Password = createUser.Password,
                FullName = createUser.FullName,
                Email = createUser.Email,
                PhoneNumber = createUser.PhoneNumber,
                Introduction = createUser.Introduction,
                RoleId = createUser.RoleId,
               
                Avarta = createUser.Avarta
                
            };
        }
    }
}
