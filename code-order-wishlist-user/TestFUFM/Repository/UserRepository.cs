using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
using DTO.UserDto;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task<List<User>> GetAllUserAsync()
        {
          return await _dbcontext.Users.Include(add => add.Addresses).ToListAsync();
        
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbcontext.Users.Include(c => c.Addresses).SingleOrDefaultAsync(i => i.UserId == id);
        }
        public async Task<User> CreateAsync(User userModel)
        {
            
            await _dbcontext.Users.AddAsync(userModel);
            await _dbcontext.SaveChangesAsync();
            return userModel;
        }
        public async Task<User?> UpdateAsync(int id, UpdateUserRequestDto updateUser)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (existingUser == null)
            {
                return null;
            }
            existingUser.Password = updateUser.Password;
            existingUser.FullName = updateUser.FullName;
            existingUser.Email = updateUser.Email;
            existingUser.PhoneNumber= updateUser.PhoneNumber;
            existingUser.Introduction = updateUser.Introduction;
            existingUser.Avarta = updateUser.Avarta;

            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var userModel = await _dbcontext.Users.FirstOrDefaultAsync(x =>x.UserId == id);
            if (userModel == null)
            {
                return null;
            }
           
            await _dbcontext.SaveChangesAsync();
            return userModel;
        }

        public Task<bool> StockExist(int id)
        {
           return _dbcontext.Users.AnyAsync(x => x.UserId == id);   
        }

     
    }
}
