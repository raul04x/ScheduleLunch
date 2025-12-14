using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SL.Domain.Entities;

namespace SL.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("t_users", "schedule");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Username)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(c => c.Username).IsUnique();
        builder.HasIndex(c => c.Email).IsUnique();

        builder.Property(u => u.PasswordHash).IsRequired();

        builder.Property(x => x.CreatedAt).IsRequired();
    }
}
