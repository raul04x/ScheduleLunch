using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SL.Domain.Entities;

namespace SL.Infrastructure.Configurations;

public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
{
    public void Configure(EntityTypeBuilder<Attendance> builder)
    {
        builder.ToTable("t_attendances", "schedule");
        builder.HasKey(a => a.Id);
        builder.HasIndex(a => new { a.UserId, a.TimeSlotId }).IsUnique();
        builder.Property(a => a.ReservedAt).IsRequired();

        builder.HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId);

        builder.HasOne(a => a.TimeSlot)
            .WithMany(s => s.Attendances)
            .HasForeignKey(a => a.TimeSlotId);
    }
}
