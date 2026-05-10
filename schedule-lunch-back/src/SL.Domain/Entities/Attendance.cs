namespace SL.Domain.Entities;

public class Attendance
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid TimeSlotId { get; set; }
    public DateTime ReservedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public TimeSlot TimeSlot { get; set; } = null!;
}
