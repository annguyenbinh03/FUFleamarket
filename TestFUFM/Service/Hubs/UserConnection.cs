using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Hubs
{
    public class UserConnection
    {
        public string UserId { get; set; }
        public string ChatRoom { get; set;}
        public string UserName { get; set; } = string.Empty;
        public string ReceiverId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
    }
}
