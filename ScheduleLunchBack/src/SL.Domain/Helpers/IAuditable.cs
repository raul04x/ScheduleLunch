using System.ComponentModel.DataAnnotations.Schema;

namespace SL.Domain.Helpers;

public class IAuditable
{
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}
