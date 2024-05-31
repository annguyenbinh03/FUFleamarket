﻿using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.FeedbackDto
{
    public class CreateFeedbackRequestDto
    {

        public string Content { get; set; } = null!;

        public int Rating { get; set; }

        public int OrderId { get; set;}

        
    }
}
