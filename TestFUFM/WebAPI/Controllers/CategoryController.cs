﻿using BusinessObjects.CategoryDto;
using BusinessObjects.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/Category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepo;

        public CategoryController(ICategoryRepository categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetALL()
        {
            var categories = await _categoryRepo.GetALLAsync();
            var categoryDTOs = categories.Select(s => s.ToCategoryDTO());
            return Ok(categoryDTOs);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var category = await _categoryRepo.GetByIDAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category.ToCategoryDTO());
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Chỉ admin mới được tạo category
        public async Task<IActionResult> Create([FromBody] CreateCategory categoryDTO)
        {
            if (!User.IsInRole("Admin"))
            {
                return Forbid("You do not have permission to create a category. This action is restricted to admins only.");
            }

            var categoryModel = categoryDTO.ToCategoryFromCreate();
            await _categoryRepo.CreateAsync(categoryModel);
            return CreatedAtAction(nameof(GetById), new { id = categoryModel.CategoryId }, categoryModel.ToCategoryDTO());
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")] // Chỉ admin mới được cập nhật category
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCategory categoryDTO)
        {
            if (!User.IsInRole("Admin"))
            {
                return Forbid("You do not have permission to update a category. This action is restricted to admins only.");
            }

            if (id != categoryDTO.CategoryId)
            {
                return BadRequest("Category ID mismatch");
            }

            var categoryModel = categoryDTO.ToCategoryFromUpdate();
            var updatedCategory = await _categoryRepo.UpdateAsync(categoryModel);

            if (updatedCategory == null)
            {
                return NotFound("Category not found");
            }

            return Ok(updatedCategory.ToCategoryDTO());
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")] // Chỉ admin mới được xóa category
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var category = await _categoryRepo.DeleteAsync(id);
            if (category == null)
            {
                return NotFound("Category not found");
            }
            return Ok(category.ToCategoryDTO());
        }
    }
}
