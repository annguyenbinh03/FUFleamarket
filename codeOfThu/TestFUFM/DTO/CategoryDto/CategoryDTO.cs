using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.CategoryDto
{
    public  class CategoryDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;

     

    }
}
