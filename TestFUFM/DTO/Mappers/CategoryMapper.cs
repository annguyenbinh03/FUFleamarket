using BusinessObjects.Models;
using DTO.CategoryDto;

namespace DTO.Mappers
{
    public static class CategoryMapper
    {
       
            public static CategoryDTO ToCategoryDTO(this Category model)
            {
                if (model == null)
                    return null;

                return new CategoryDTO
                {
                    CategoryId = model.CategoryId,
                    Name = model.Name
                };
            }
        public static Category ToCategoryFromCreate(this CreateCategory categoryDTO)
        {
            return new Category
            {
                Name = categoryDTO.Name,
                // Không cần UserId nếu không liên quan đến Product
            };
        }
        public static Category ToCategoryFromUpdate(this UpdateCategory categoryDTO)
        {
            return new Category
            {
                CategoryId = categoryDTO.CategoryId,
                Name = categoryDTO.Name
            };
        }
    }
}