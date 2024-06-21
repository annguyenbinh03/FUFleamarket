using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.UserDto;

namespace Repository.Interfaces
{
    public interface IUserRepository
    {
        public Task<List<User>> GetAllUserAsync();
        public Task<List<User>> GetAllUserForChatAsync();
        public Task<User?> GetByIdAsync(int id);
        public Task<User> CreateAsync(User userMode);
        public Task<User?> UpdateAsync(int id, UpdateUserRequestDto userDto);
        public Task<User?> BanAccount(int id);
        public Task<User?> UnBanAccount(int id);
        public Task<bool> UserExists(int id);
        public Task<bool> CheckUser(int id);

        public Task<User> GetProfileUser(int userId);
    }
}
