﻿using BusinessObjects.Models;
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
          return await _dbcontext.Users.ToListAsync();
        
        }
        public async Task<List<User>> GetAllUserForChatAsync()
        {
            return await _dbcontext.Users
                .Where(x => x.RoleId == 1 && x.ContactUser1Navigations.Any( c => c.IsActive) ||
                     x.ContactUser2Navigations.Any(c => c.IsActive))
                .Select(
                    x => new User
                    {
                        UserId = x.UserId,
                        FullName = x.FullName,
                        Avarta = x.Avarta
                    }
                ).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbcontext.Users.SingleOrDefaultAsync(user => user.UserId == id);
        }


        public async Task<User?> UpdateAsync(int id, UpdateUserRequestDto userDto)
        {
            var existingUser = await _dbcontext.Users.FirstOrDefaultAsync(x => x.UserId == id);
            if(existingUser == null)
            {
                return null;
            }

            if (userDto.Password != null)
            {
                existingUser.Password = userDto.Password;
            } 
            existingUser.FullName = userDto.FullName;
            existingUser.PhoneNumber = userDto.PhoneNumber;
            existingUser.Introduction = userDto.Introduction;                        
            existingUser.Avarta = userDto.Avarta;
            existingUser.Address = userDto.Address;
            existingUser.AcceptedTradingPercent = userDto.AcceptedTradingPercent;

            await _dbcontext.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> IsExistUser(int id)
        {
            return await _dbcontext.Users.AnyAsync(x => x.UserId == id);
        }
        public async Task<User?> GetProfileUser(int userId)
        {
            // Query the database to get the profile by User ID
            return await _dbcontext.Users.Where(user => user.UserId == userId).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetUsersByIdsAsync(IEnumerable<int> userIds)
        {
            return await _dbcontext.Users
                                   .Where(user => userIds.Contains(user.UserId))
                                   .ToListAsync();
        }

    }
}
