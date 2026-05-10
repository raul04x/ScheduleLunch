using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SL.Domain.Entities;

namespace SL.Infrastructure.Configurations;

public class TimeSlotConfiguration : IEntityTypeConfiguration<TimeSlot>
{
    public void Configure(EntityTypeBuilder<TimeSlot> builder)
    {
        builder.ToTable("t_time_slots", "schedule");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Label).IsRequired().HasMaxLength(50);
        builder.Property(s => s.Capacity).IsRequired();
        builder.Property(s => s.Date).IsRequired();
        builder.Property(s => s.StartTime).IsRequired();
        builder.Property(s => s.EndTime).IsRequired();
        builder.Property(s => s.CreatedAt).IsRequired();

        builder.HasOne(s => s.Group)
            .WithMany(g => g.TimeSlots)
            .HasForeignKey(s => s.GroupId);
    }
}
