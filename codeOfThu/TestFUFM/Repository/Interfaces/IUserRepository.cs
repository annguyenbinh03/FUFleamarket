using BusinessObjects.Models;
using DTO.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IUserRepository
    {
        public Task<List<User>> GetAllUserAsync();
        Task<User?> GetByIdUserAsync(int id);

        Task<User?> CreateAsync(User userModel);

        Task<User?> UpdateAsync(int  id, UpdateUserRequestDto userDto);

        Task<User?> DeleteAsync(int id);
    }
}
