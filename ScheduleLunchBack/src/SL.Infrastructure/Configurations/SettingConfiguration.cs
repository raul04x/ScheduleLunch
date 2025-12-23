using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SL.Domain.Entities;
using SL.Domain.Helpers;

namespace SL.Infrastructure.Configurations;

public class SettingConfiguration : IEntityTypeConfiguration<Setting>
{
    public void Configure(EntityTypeBuilder<Setting> builder)
    {
        builder.ToTable("t_settings", "schedule");

        builder.HasKey(u => u.KeyName);
        builder.HasIndex(c => c.KeyName).IsUnique();

        builder.Property(u => u.Config)
            .IsRequired()
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<CustomSetting>(v, (JsonSerializerOptions?)null) ?? new CustomSetting()
            );

        builder.Property(u => u.KeyName)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
