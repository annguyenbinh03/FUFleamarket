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


    }
}
