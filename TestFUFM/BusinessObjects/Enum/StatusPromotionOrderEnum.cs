namespace BusinessObjects.Models.Enum;

public enum StatusPromotionOrderEnum
{
    Pending,    // Order is awaiting approval or some other action
    Approved,   // Order has been approved
    Failed,   // Order has been declined
    Cancelled,  // Order has been cancelled
    Completed,   // Order has been completed
    Active,
    InActive
}
