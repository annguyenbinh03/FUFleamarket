using BusinessObjects.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly FufleaMarketContext _Catecontext;
        public CategoryRepository(FufleaMarketContext Catecontext)
        {
            _Catecontext = Catecontext;
        }


        public async Task<List<Category>> GetALLAsync()
        {
            return await _Catecontext.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIDAsync(int id)
        {
            return await _Catecontext.Categories.FindAsync(id);

        }
    }
}
