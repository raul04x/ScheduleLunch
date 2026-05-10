using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SL.Domain.Entities;

namespace SL.Infrastructure.Configurations;

public class GroupMembershipConfiguration : IEntityTypeConfiguration<GroupMembership>
{
    public void Configure(EntityTypeBuilder<GroupMembership> builder)
    {
        builder.ToTable("t_group_memberships", "schedule");
        builder.HasKey(m => new { m.UserId, m.GroupId });

        builder.Property(m => m.Status).IsRequired().HasConversion<string>();
        builder.Property(m => m.Role).IsRequired().HasConversion<string>();
        builder.Property(m => m.JoinedAt).IsRequired();

        builder.HasOne(m => m.User)
            .WithMany(u => u.Memberships)
            .HasForeignKey(m => m.UserId);

        builder.HasOne(m => m.Group)
            .WithMany(g => g.Memberships)
            .HasForeignKey(m => m.GroupId);
    }
}
