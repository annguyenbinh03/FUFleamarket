using DTO.CategoryDto;
using DTO.Mappers;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{ 
    [Route("api/Category")]
    [ApiController]

    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;
        

        public CategoryController (ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
          
        }
        [HttpGet]
        public async Task<IActionResult> GetALL()
        {
            var categorys = await _categoryRepo.GetALLAsync();

            var CategoryDTO = categorys.Select(s => s.ToCategoryDTO());

            return Ok(CategoryDTO);
            
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        { 
            var catgory = await _categoryRepo.GetByIDAsync(id);
            if (catgory == null)
            {
                return NotFound();
            }
            return Ok(catgory.ToCategoryDTO());

        }

       

    }
}
