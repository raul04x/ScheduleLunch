﻿using Newtonsoft.Json;
using System;

namespace SL.Api.Models
{
    public class Eater
    {
        [JsonProperty(PropertyName = "oldName")]
        public String OldName { get; set; }

        [JsonProperty(PropertyName = "newName")]
        public String NewName { get; set; }

        [JsonProperty(PropertyName = "hour")]
        public String Hour { get; set; }

        [JsonProperty(PropertyName = "isOut")]
        public Boolean IsOut { get; set; }
    }
}
