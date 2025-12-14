using Microsoft.EntityFrameworkCore;
using SL.Domain.Entities;
using SL.Domain.Helpers;

namespace SL.Infrastructure.Data;

public class ScheduleDbContext : DbContext
{
    public ScheduleDbContext(DbContextOptions<ScheduleDbContext> options)
        : base(options) { }

    public DbSet<Setting> Settings => Set<Setting>();

    public DbSet<User> Users => Set<User>();

    private void ApplyAuditInfo()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditable>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = null;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;

                // Evita que CreatedAt se modifique
                entry.Property(x => x.CreatedAt).IsModified = false;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("schedule");

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ScheduleDbContext).Assembly);
    }

    public override async Task<int> SaveChangesAsync(
    CancellationToken cancellationToken = default)
    {
        ApplyAuditInfo();
        return await base.SaveChangesAsync(cancellationToken);
    }


    public override int SaveChanges()
    {
        ApplyAuditInfo();
        return base.SaveChanges();
    }
}