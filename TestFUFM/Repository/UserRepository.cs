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
    }
}
