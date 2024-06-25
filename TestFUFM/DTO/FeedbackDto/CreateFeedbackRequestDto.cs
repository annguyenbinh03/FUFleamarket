﻿using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.FeedbackDto
{
    public class CreateFeedbackRequestDto
    {

        public string Content { get; set; } = null!;

        public int Rating { get; set; }

        public int OrderId { get; set;}
        public int RatedId { get; set; }
        public string Type { get; set; }
    }
}
