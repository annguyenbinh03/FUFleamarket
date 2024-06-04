using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetALLAsync();
        Task<Category?> GetByIDAsync(int id);
        Task<Category?> CreateAsync(Category categoryModel);

        Task<Category?> UpdateAsync(Category categoryModel);
        Task<Category?> DeleteAsync(int id); // Thêm phương thức DeleteAsync
        Task<bool> IsCategoryNameExistsAsync(string name);
    }
}
