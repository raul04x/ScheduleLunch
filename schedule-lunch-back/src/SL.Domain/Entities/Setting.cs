using System.ComponentModel.DataAnnotations.Schema;
using SL.Domain.Helpers;

namespace SL.Domain.Entities;

public class Setting : IAuditable
{
    [Column("key-name")]
    public string KeyName { get; set; } = string.Empty;

    [Column("config", TypeName = "jsonb")]
    public CustomSetting Config { get; set; } = new();
}
