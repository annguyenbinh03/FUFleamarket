using BusinessObjects.Models;
using BusinessObjects;
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

        public async Task<Category?> CreateAsync(Category categoryModel)
        {
            await _Catecontext.Categories.AddAsync(categoryModel);
            await _Catecontext.SaveChangesAsync();
            return categoryModel;
        }

        public async Task<List<Category>> GetALLAsync()
        {
            return await _Catecontext.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIDAsync(int id)
        {
            return await _Catecontext.Categories.FindAsync(id);
        }

        public async Task<Category?> DeleteAsync(int id)
        {
            var categoryModel = await _Catecontext.Categories.FindAsync(id);
            if (categoryModel == null)
            {
                return null;
            }

            _Catecontext.Categories.Remove(categoryModel);
            await _Catecontext.SaveChangesAsync();
            return categoryModel;
        }

        public async Task<Category?> UpdateAsync(Category categoryModel)
        {
            var existingCategory = await _Catecontext.Categories.FindAsync(categoryModel.CategoryId);
            if (existingCategory == null)
            {
                return null;
            }

            existingCategory.Name = categoryModel.Name;

            _Catecontext.Categories.Update(existingCategory);
            await _Catecontext.SaveChangesAsync();
            return existingCategory;
        }
    }
}
