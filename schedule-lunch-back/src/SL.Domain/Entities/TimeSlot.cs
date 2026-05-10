using SL.Domain.Helpers;

namespace SL.Domain.Entities;

public class TimeSlot : IAuditable
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid GroupId { get; set; }
    public DateOnly Date { get; set; }
    public string Label { get; set; } = string.Empty;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int Capacity { get; set; }

    public Group Group { get; set; } = null!;
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}
