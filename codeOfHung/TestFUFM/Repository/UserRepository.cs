using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.UserDto;

namespace Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly FufleaMarketContext _dbcontext;

        public UserRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<User> CreateAsync(User userMode)
        {
            await _dbcontext.AddAsync(userMode);
            await _dbcontext.SaveChangesAsync();
            return userMode;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if (existingUser == null)
            {
                return null;
            }
             // Set the status to false directly
            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }


        

        public async Task<List<User>> GetAllUserAsync()
        {
          return await _dbcontext.Users.Include(add => add.Addresses).ToListAsync();
        
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbcontext.Users
                                   .Include(user => user.Addresses)
                                   .SingleOrDefaultAsync(user => user.UserId == id);
        }


        public async Task<User?> UpdateAsync(int id, UpdateUserRequestDto userDto)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if(existingUser == null)
            {
                return null;
            }
            
            existingUser.Password = userDto.Password;
            existingUser.FullName = userDto.FullName;
            existingUser.Email = userDto.Email;
            existingUser.PhoneNumber = userDto.PhoneNumber;
            existingUser.Introduction = userDto.Introduction;
            existingUser.RoleId = userDto.RoleId;
             
            existingUser.Avarta = userDto.Avarta;

            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }

        public Task<bool> UserExists(int id)
        {
            return _dbcontext.Users.AnyAsync(x => x.UserId == id);
        }
    }
}
