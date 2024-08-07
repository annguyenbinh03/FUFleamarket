﻿using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.UserDto
{
    public class UserDTO
    {

        public int UserId { get; set; }


        public string? Password { get; set; }

        public string? FullName { get; set; }


        public string Email { get; set; } = null!;


        public string? PhoneNumber { get; set; }


        public string? Introduction { get; set; }


        public int RoleId { get; set; }


        public bool IsDeleted { get; set; }


        public string? Avarta { get; set; }


        public DateTime CreatedDate { get; set; }


        public string? Sub { get; set; }


        public string? Address { get; set; }


        public double? AcceptedTradingPercent { get; set; }


        public double? BuyRating { get; set; }


        public int? BuyTimes { get; set; }


        public double? SellRating { get; set; }


        public int? SellTimes { get; set; }
    }


    
}
