using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
using DTO.UserDto;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly FufleaMarketContext _dbcontext;

        public UserRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<User> CreateAsync(User userModel)
        {
            userModel.RoleId = 1; // Mặc định roleId=1
            userModel.Status = true; // Mặc định status=true
            await _dbcontext.Users.AddAsync(userModel);
            await _dbcontext.SaveChangesAsync();
            return userModel;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var userModel = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if (userModel == null)
            {
                return null;
            }

            userModel.Status = false; // Đặt status=false khi xóa người dùng
            await _dbcontext.SaveChangesAsync();
            return userModel;
        }

        public async Task<List<User>> GetAllUserAsync()
        {
          return await _dbcontext.Users.Include(add => add.Addresses).ToListAsync();
        
        }

        public async Task<User?> GetByIdUserAsync(int id)
        {
            return await _dbcontext.Users.FindAsync(id);
        }

        public async Task<User?> UpdateAsync(int id, UpdateUserRequestDto userDto)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if (existingUser == null)
            {
                return null;
            }

            // Cập nhật các thuộc tính chỉ định
            existingUser.Password = userDto.Password;
            existingUser.FullName = userDto.FullName;
            existingUser.Email = userDto.Email;
            existingUser.PhoneNumber = userDto.PhoneNumber;
            existingUser.Introduction = userDto.Introduction;
            existingUser.Avarta = userDto.Avarta;

            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }
    }
}
