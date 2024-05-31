namespace DTO.WishlistDto
{
    public class CreateWishlistDto
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsNew { get; set; }
        public int SellerId { get; set; }
        public int CategoryId { get; set; }
        public bool Status { get; set; }
        
    }
}
