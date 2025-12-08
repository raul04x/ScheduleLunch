using Newtonsoft.Json;
using SL.Api.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SL.Api.Helpers
{
    public class JsonFiles
    {
        private static JsonFiles instance;

        public static JsonFiles Instance
        {
            get
            {
                if (instance == null)
                    instance = new JsonFiles();
                return instance;
            }
        }

        private JsonFiles() { }

        public Boolean Exists(String file)
        {
            return File.Exists(file);
        }

        public void WriteFile<T>(String file, T value)
        {
            String dataConfig = JsonConvert.SerializeObject(value, Formatting.Indented);
            File.WriteAllText(file, dataConfig);
        }

        public T GetObjectFile<T>(String file)
        {
            String dataConfig = File.ReadAllText(file);
            T result = JsonConvert.DeserializeObject<T>(dataConfig);
            return result;
        }

        public Configurations GetConfigurations(String configFile)
        {
            Configurations config = new Configurations()
            {
                Capacity = 8,
                StartTime = 12,
                EndTime = 2,
                MinutesInterval = 20
            };

            if (Instance.Exists(configFile))
            {
                try
                {
                    config = JsonFiles.Instance.GetObjectFile<Configurations>(configFile);
                }
                catch (Exception ex)
                {
                    config.ErrorMessage = ex.Message;
                }
            }
            else
            {
                try
                {
                    JsonFiles.Instance.WriteFile<Configurations>(configFile, config);
                }
                catch (Exception ex)
                {
                    config.ErrorMessage = ex.Message;
                }
            }

            return config;
        }
    }
}
