using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace SL.Api.Models
{
    public class Scheduler
    {
        [JsonProperty(PropertyName = "id")]
        public String Id { get; set; }

        [JsonProperty(PropertyName = "groups")]
        public List<Hours> Groups { get; set; }

        public class Hours
        {
            [JsonProperty(PropertyName = "id")]
            public String Id { get; set; }

            [JsonProperty(PropertyName = "eaters")]
            public List<String> Eaters { get; set; }
        }

        [JsonProperty(PropertyName = "errorMessage")]
        public String ErrorMessage { get; set; }
    }
}
