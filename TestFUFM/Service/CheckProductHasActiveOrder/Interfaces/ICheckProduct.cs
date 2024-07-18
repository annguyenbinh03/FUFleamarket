using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CheckProductHasActiveOrder.Interfaces
{
    public interface ICheckProduct
    {
        Task<bool> CheckProductHasAnyActiveOrderAsync(int productId);
    }
}
