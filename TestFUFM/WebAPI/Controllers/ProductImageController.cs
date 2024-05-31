using DTO.Mappers;
using DTO.ProductDto;
using DTO.ProductImageDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/ProductImage")]
    [ApiController]
        public class ProductImageController : ControllerBase
        {
            private readonly IProductImageRepository _productImageRepo;
           private readonly IProductReposity _productRepo;

        public ProductImageController(IProductImageRepository productImageRepo, IProductReposity productRepo)
            {
                _productImageRepo = productImageRepo;
                _productRepo = productRepo;
            }
        
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if(!ModelState.IsValid)
            return BadRequest(ModelState);
            var productImages = await _productImageRepo.GetALLAsync();
            var productImagesDTO = productImages.Select(pi => pi.ToProductImageDto()).ToList();
            return Ok(productImagesDTO);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var productImage = await _productImageRepo.GetByIDAsync(id);
            if (productImage == null)
            {
                return NotFound();
            }
            return Ok(productImage.ToProductImageDto());

        }



        [HttpPost("{ProductId:int}")]
        public async Task<IActionResult> Create([FromRoute] int ProductId, [FromBody] CreateProductImageDTO productImageDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (!await _productRepo.ProductExist(ProductId))
            {
                return BadRequest("Product does not exist");
            }
            var productImageModel = productImageDTO.ToProductImageFromCreate(ProductId);
            await _productImageRepo.CreateAsync(productImageModel);
            return CreatedAtAction(nameof(GetById), new { id = productImageModel.ProductId }, productImageModel.ToProductImageDto());
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductImageRequestDTO  updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var productImage = await _productImageRepo.UpdateAsync(id, updateDto.ToProductImageFromUpdate());
            if (productImage == null)
            {
                return NotFound("ProductImage not found");
            }
            return Ok(productImage.ToProductImageDto());

        }



        [HttpDelete]
        [Route("{id:int}")]

        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var productImageModel = await _productImageRepo.DeleteAsync(id);
      
            if (productImageModel == null)
            {
                return NotFound("productImageModel does not exist");
            }
            return Ok(productImageModel);
        }
    }
}
