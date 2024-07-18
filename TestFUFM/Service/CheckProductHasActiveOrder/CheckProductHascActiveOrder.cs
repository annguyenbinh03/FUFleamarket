using Repository.Interfaces;
using Service.CheckProductHasActiveOrder.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CheckProductHasActiveOrder
{
    public class CheckProductHascActiveOrder : ICheckProduct
    {
        private readonly IProductReposity _productRepo;
        private readonly IOrderRepository _orderRepo;
        public CheckProductHascActiveOrder(IProductReposity productRepo, IOrderRepository orderRepo)
        {
            _productRepo = productRepo;
            _orderRepo = orderRepo;
        }
        public async Task<bool> CheckProductHasAnyActiveOrderAsync(int id)
        {
            var product = await _productRepo.GetProductByIdAsync(id);

            if (product == null)
            {
                throw new ArgumentException($"Product with ID {id} does not exist.");
            }

            if(product.Status == 0 || product.Status == 1)
            {
                return await _orderRepo.CheckProductHasAnyActiveOrder(id);
            }
            return true;//ti sua lai
        }
        
    }
}
