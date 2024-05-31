using DTO;
using DTO.Helpers;
using DTO.Mappers;
using DTO.ProductDto;
using DTO.UserDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly FufleaMarketContext _context;
        private readonly IProductReposity _productRepo;
        public ProductController(FufleaMarketContext context, IProductReposity productRepo)
        {
            _productRepo= productRepo;
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var products = await _productRepo.GetALLAsync(query);
            var productDto = products.Select(s => s.ToProductDto());

            return Ok(productDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute]int id) 
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var product =await _productRepo.GetByIdProductAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product.ToProductDto());
        }
         [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateProductRequestDto productDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var productModel = productDto.ToProductFromCreateDTO();
           await _productRepo.CreateAsync(productModel);
            return CreatedAtAction(nameof(GetById), new { id = productModel.ProductId }, productModel.ToProductDto());

        }
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductRequestDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var productModel =await _productRepo.UpdateAsync(id, updateDto);
            if (productModel == null)
            {
                return NotFound();
            }
            return Ok(productModel.ToProductDto());
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var productModel = await _productRepo.DeleteAsync(id);
            if (productModel == null)
            {
                return NotFound();
            }


            return NoContent();

        }
        //[HttpDelete("{id:int}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    var productModel = await _productRepo.DeleteAsync(id);
        //    if (productModel == null)
        //    {
        //        return NotFound();
        //    }

        //    // Update the properties on productModel
        //    productModel.isNew = false;
        //    productModel.status = 2;

        //    // Save the updated productModel in the repository
        //    await _productRepo.UpdateAsync(productModel);

        //    return NoContent();
        //}
    }
}
