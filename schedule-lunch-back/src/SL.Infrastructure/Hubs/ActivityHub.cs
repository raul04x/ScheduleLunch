using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SL.Infrastructure.Hubs;

[Authorize]
public class ActivityHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var groupId = Context.User?.FindFirst("groupId")?.Value;
        if (groupId is not null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"group-{groupId}");
        await base.OnConnectedAsync();
    }
}
