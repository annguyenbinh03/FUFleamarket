using DTO.ProductDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculateProductMonthlyTotal.Interfaces
{
    public interface  IProductService
    {
        Task<List<TopSellingProductDTO>> GetTop5BestSellingProductsAsync();
    }
}
