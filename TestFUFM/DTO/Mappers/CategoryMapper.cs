using BusinessObjects.Models;
using DTO.CategoryDto;

namespace DTO.Mappers
{
    public static class CategoryMapper
    {
        ////public static CategoryDTO ToCategoryDTO(this Category model)
        ////{
        ////    return new CategoryDTO
        ////    {
        ////        CategoryId = model.CategoryId,
        ////        Name = model.Name
        ////    };
        ////}
        //public static CategoryDTO ToCategoryDTO(this Category model)
        //{
        //    if (model == null)
        //        return null;

        //    return new CategoryDTO
        //    {
        //        CategoryId = model.CategoryId,
        //        Name = model.Name
        //    };
        //}
       
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
       
    }
}