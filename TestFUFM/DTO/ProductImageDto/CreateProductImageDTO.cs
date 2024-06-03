using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.ProductImageDto
{
  public class CreateProductImageDTO
    {
        [Required(ErrorMessage = "ImageName is required")]
        [MinLength(5, ErrorMessage = "ImageName must be at least 5 characters")]
        [MaxLength(280, ErrorMessage = "ImageName must not exceed 280 characters")]
        public string ImageName { get; set; } = null!;

        [Required(ErrorMessage = "ImageLink is required")]
        [StringLength(280, MinimumLength = 5, ErrorMessage = "ImageLink must be between 5 and 280 characters")]
        public string ImageLink { get; set; } = null!;
    }
}
