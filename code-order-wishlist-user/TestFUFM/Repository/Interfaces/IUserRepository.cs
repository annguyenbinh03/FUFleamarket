using BusinessObjects.Models;
using DTO.UserDto;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IUserRepository
    {
        public Task<List<User>> GetAllUserAsync();
        public Task<User?> GetByIdAsync(int id);
        public Task<User> CreateAsync(User userModel);
        public Task<User?> UpdateAsync(int id, UpdateUserRequestDto updateUser);
        public Task<User?> DeleteAsync(int id);
        public Task<bool> StockExist(int id);
    }
}
