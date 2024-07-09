using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.ContactCheck.Interfaces
{
    public interface IContactService
    {
        Task<bool> CheckAndManageContactAsync(int user1, int user2);
    }
}
