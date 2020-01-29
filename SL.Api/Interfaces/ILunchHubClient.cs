using SL.Api.Models;
using System.Threading.Tasks;

namespace SL.Api.Interfaces
{
    public interface ILunchHubClient
    {
        Task BroadcastMessage(Eater user, Scheduler scheduler);
    }
}
