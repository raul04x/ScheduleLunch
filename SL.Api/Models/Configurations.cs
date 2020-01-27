using Newtonsoft.Json;
using System;

namespace SL.Api.Models
{
    public class Configurations
    {
        public Int16 Capacity { get; set; }
        public Int16 StartTime { get; set; }
        public Int16 EndTime { get; set; }
        public Int16 MinutesInterval { get; set; }
        public String ErrorMessage { get; set; }
    }
}
