using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.CategoryDto
{
    public class CreateCategory
    {
        [Required(ErrorMessage = "Name is required")]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters")]
        [MaxLength(50, ErrorMessage = "Name must not exceed 50 characters")]
        public string Name { get; set; } = null!;
    }
}
