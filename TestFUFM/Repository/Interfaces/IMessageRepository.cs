﻿using BusinessObjects.Models;
using BusinessObjects.MessageDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IMessageRepository
    {
        Task CreateAMessageAsync(int chatRoom,int userId,string msg);
    }   
}
