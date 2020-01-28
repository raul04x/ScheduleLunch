using Newtonsoft.Json;
using System;

namespace SL.Api.Models
{
    public class Eater
    {
        [JsonProperty(PropertyName = "oldName")]
        public String OldName { get; set; }

        [JsonProperty(PropertyName = "newName")]
        public String NewName { get; set; }
    }
}
