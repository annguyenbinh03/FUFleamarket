
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.UserDto
{
    public class UpdateUserRequestDto
    {
        [StringLength(20)]
        public string? Password { get; set; }
        [StringLength(30)]
        public string? FullName { get; set; }
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        [StringLength(300)]
        public string? Introduction { get; set; }       
        [StringLength(200)]
        public string? Avarta { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        public double? AcceptedTradingPercent { get; set; }

    }
}
