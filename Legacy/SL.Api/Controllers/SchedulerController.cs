using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SL.Api.Helpers;
using SL.Api.Interfaces;
using SL.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using static SL.Api.Models.Scheduler;

namespace SL.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SchedulerController : ControllerBase
    {
        private static String ConfigFile => String.Format("{0}\\ConfigFiles\\config.json", Environment.CurrentDirectory);
        private static String ScheduleFile => String.Format("{0}\\ConfigFiles\\schedule.json", Environment.CurrentDirectory);

        private IHubContext<NotifyHub, ILunchHubClient> HubContext { get; set; }

        public SchedulerController(IHubContext<NotifyHub, ILunchHubClient> hubContext)
        {
            HubContext = hubContext;
        }

        // GET scheduler
        [HttpGet]
        public ActionResult<Object> Get()
        {
            return new { message = "Service is alive!" };
        }

        // GET scheduler/GetConfigFile
        [HttpGet("[action]")]
        public ActionResult<Configurations> GetConfigFile()
        {
            return JsonFiles.Instance.GetConfigurations(ConfigFile);
        }

        // POST scheduler/SetConfigFile
        [HttpPost("[action]")]
        public ActionResult<Configurations> SetConfigFile([FromBody] Configurations config)
        {
            try
            {
                JsonFiles.Instance.WriteFile<Configurations>(ConfigFile, config);
            }
            catch (Exception ex)
            {
                config.ErrorMessage = ex.Message;
            }

            return config;
        }

        // Get scheduler/GetSchedule
        [HttpGet("[action]")]
        public ActionResult<Scheduler> GetSchedule()
        {
            Scheduler schedule = new Scheduler();

            if (JsonFiles.Instance.Exists(ScheduleFile))
            {
                try
                {
                    schedule = JsonFiles.Instance.GetObjectFile<Scheduler>(ScheduleFile);
                }
                catch (Exception ex)
                {
                    schedule.ErrorMessage = ex.Message;
                }
            }
            else
            {
                schedule.ErrorMessage = "File not found yet!";
            }

            return schedule;
        }

        // POST scheduler/SetSchedule
        [HttpPost("[action]")]
        public ActionResult<Scheduler> SetSchedule([FromBody] Scheduler scheduler)
        {
            String id = DateTime.Now.ToString("yyyyMMdd");

            try
            {
                Configurations config = JsonFiles.Instance.GetConfigurations(ConfigFile);

                if (!scheduler.Id.Equals(id))
                {
                    Scheduler.Hours hour;
                    TimeSpan time = new TimeSpan(config.StartTime, 0, 0);
                    TimeSpan until = new TimeSpan(config.EndTime, 0, 0);
                    TimeSpan minutes = TimeSpan.FromMinutes(config.MinutesInterval);

                    scheduler = new Scheduler();
                    scheduler.Id = id;
                    scheduler.Groups = new List<Scheduler.Hours>();

                    while (time < until)
                    {
                        hour = new Scheduler.Hours();
                        hour.Id = time.ToString("hhmm");
                        hour.Eaters = new List<String>();
                        scheduler.Groups.Add(hour);
                        time = time.Add(minutes);
                    }
                }

                JsonFiles.Instance.WriteFile<Scheduler>(ScheduleFile, scheduler);
            }
            catch (Exception ex)
            {
                scheduler.ErrorMessage = ex.Message;
            }
            return scheduler;
        }

        // Post scheduler/AddEather
        [HttpPost("[action]")]
        public ActionResult<Scheduler> AddEather([FromBody] Hours eater)
        {
            Scheduler scheduler = new Scheduler();

            try
            {
                Configurations config = JsonFiles.Instance.GetConfigurations(ConfigFile);
                Hours currentHour;

                scheduler = JsonFiles.Instance.GetObjectFile<Scheduler>(ScheduleFile);
                currentHour = scheduler.Groups.FirstOrDefault(ch => ch.Id == eater.Id);
                scheduler.ErrorMessage = String.Empty;

                if (eater.Eaters.Count > 0 && currentHour != null)
                {
                    if (currentHour.Eaters.Count < config.Capacity)
                    {
                        currentHour.Eaters.Add(eater.Eaters[0]);
                    }
                    else
                    {
                        scheduler.ErrorMessage = String.Format("This hour ({0}) is full!", eater.Id);
                    }

                    JsonFiles.Instance.WriteFile<Scheduler>(ScheduleFile, scheduler);

                    Eater eaterNot = new Eater
                    {
                        Hour = eater.Id,
                        IsOut = false,
                        NewName = eater.Eaters[0]
                    };
                    HubContext.Clients.All.BroadcastMessage(eaterNot, scheduler);
                }
            }
            catch (Exception ex)
            {
                scheduler.ErrorMessage = ex.Message;
            }

            return scheduler;
        }

        // Post scheduler/RemoveEather
        [HttpPost("[action]")]
        public ActionResult<Scheduler> RemoveEather([FromBody] Hours eater)
        {
            Scheduler scheduler = new Scheduler();

            try
            {
                Hours currentHour;

                scheduler = JsonFiles.Instance.GetObjectFile<Scheduler>(ScheduleFile);
                currentHour = scheduler.Groups.FirstOrDefault(ch => ch.Id == eater.Id);
                scheduler.ErrorMessage = String.Empty;

                if (eater.Eaters.Count > 0 && currentHour != null)
                {
                    currentHour.Eaters.Remove(eater.Eaters[0]);
                    JsonFiles.Instance.WriteFile<Scheduler>(ScheduleFile, scheduler);

                    Eater eaterNot = new Eater
                    {
                        Hour = eater.Id,
                        IsOut = true,
                        NewName = eater.Eaters[0]
                    };
                    HubContext.Clients.All.BroadcastMessage(eaterNot, scheduler);
                }
            }
            catch (Exception ex)
            {
                scheduler.ErrorMessage = ex.Message;
            }

            return scheduler;
        }

        // Post scheduler/ChangeEaterName
        [HttpPost("[action]")]
        public ActionResult<Scheduler> ChangeEaterName([FromBody] Eater eather)
        {
            Scheduler scheduler = new Scheduler();
            Int32 counter = 0;

            try
            {
                scheduler = JsonFiles.Instance.GetObjectFile<Scheduler>(ScheduleFile);

                for (int i = 0; i < scheduler.Groups.Count; i++)
                {
                    counter = scheduler.Groups[i].Eaters.Count;
                    for (int j = 0; j < counter; j++)
                    {
                        if (scheduler.Groups[i].Eaters[j].Equals(eather.OldName))
                        {
                            scheduler.Groups[i].Eaters[j] = eather.NewName;
                            j = scheduler.Groups[i].Eaters.Count;
                            i = scheduler.Groups.Count;
                        }
                    }
                }

                JsonFiles.Instance.WriteFile<Scheduler>(ScheduleFile, scheduler);

                Eater eaterNot = new Eater
                {
                    Hour = String.Empty,
                    IsOut = false,
                    NewName = "-none-"
                };
                HubContext.Clients.All.BroadcastMessage(eaterNot, scheduler);
            }
            catch (Exception ex)
            {
                scheduler.ErrorMessage = ex.Message;
            }

            return scheduler;
        }
    }
}
