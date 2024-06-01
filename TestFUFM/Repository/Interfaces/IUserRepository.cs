using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.UserDto;

namespace Repository.Interfaces
{
    public interface IUserRepository
    {
        public Task<List<User>> GetAllUserAsync();
        public Task<User?> GetByIdAsync(int id);
        public Task<User> CreateAsync(User userMode);
        public Task<User?> UpdateAsync(int id, UpdateUserRequestDto userDto);
        public Task<User?> DeleteAsync(int id);
        public Task<bool> UserExists(int id);

        Task<IEnumerable<User>> GetProfileUser(int userId);
    }
}
