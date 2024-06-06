using BusinessObjects.Models;
using BusinessObjects;
using BusinessObjects.Mappers;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.UserDto;

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

        public async Task<User?> BanAccount(int id)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if (existingUser == null)
            {
                return null;
            }
            existingUser.IsDeleted = true;
            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }
        public async Task<User> UnBanAccount(int id)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if (existingUser == null)
            {
                return null;
            }
            existingUser.IsDeleted = false;
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
            existingUser.Avarta = userDto.Avarta;

            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }

        public Task<bool> UserExists(int id)
        {
            return _dbcontext.Users.AnyAsync(x => x.UserId == id);
        }
        public async Task<User> GetProfileUser(int userId)
        {
            // Query the database to get the profile by User ID
            return await _dbcontext.Users.Include(x=>x.Addresses).Where(user => user.UserId == userId).FirstOrDefaultAsync();
        }
    }
}
