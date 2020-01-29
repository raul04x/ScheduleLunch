using Microsoft.AspNetCore.SignalR;
using SL.Api.Interfaces;

namespace SL.Api.Helpers
{
    public class NotifyHub : Hub<ILunchHubClient>
    {
    }
}
