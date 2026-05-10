using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using SL.Application.DTOs;
using SL.Application.Interfaces;
using SL.Infrastructure.Hubs;

namespace SL.Api.Controllers;

[ApiController]
[Route("api/schedule")]
[Authorize]
public class ScheduleController(IScheduleService scheduleService, IHubContext<ActivityHub> hub) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string CurrentUsername => User.FindFirstValue(ClaimTypes.Name)!;
    private Guid? CurrentGroupId => Guid.TryParse(User.FindFirst("groupId")?.Value, out var id) ? id : null;

    [HttpGet("week")]
    public async Task<IActionResult> GetWeek() =>
        CurrentGroupId is not { } gid ? Forbid() :
        Ok(await scheduleService.GetWeekSlotsAsync(gid, CurrentUserId));

    [HttpGet("day")]
    public async Task<IActionResult> GetDay([FromQuery] DateOnly date) =>
        CurrentGroupId is not { } gid ? Forbid() :
        Ok(await scheduleService.GetDaySlotsAsync(gid, date, CurrentUserId));

    [HttpPost("{slotId}/reserve")]
    public async Task<IActionResult> Reserve(Guid slotId)
    {
        if (CurrentGroupId is not { } gid) return Forbid();
        var slot = await scheduleService.ReserveSlotAsync(slotId, CurrentUserId);
        await hub.Clients.Group($"group-{gid}")
            .SendAsync("UserReserved", new ActivityEventDto(
                CurrentUsername, slot.Label, slot.Date.ToString("yyyy-MM-dd"),
                slot.AttendeeCount, slot.Capacity));
        return Ok(slot);
    }

    [HttpDelete("{slotId}/reserve")]
    public async Task<IActionResult> Cancel(Guid slotId)
    {
        if (CurrentGroupId is not { } gid) return Forbid();
        var slot = await scheduleService.CancelReservationAsync(slotId, CurrentUserId);
        await hub.Clients.Group($"group-{gid}")
            .SendAsync("UserCancelled", new ActivityEventDto(
                CurrentUsername, slot.Label, slot.Date.ToString("yyyy-MM-dd"),
                slot.AttendeeCount, slot.Capacity));
        return Ok(slot);
    }

    [HttpPost("slots")]
    [Authorize(Roles = "GroupAdmin,SuperAdmin")]
    public async Task<IActionResult> CreateSlot(CreateTimeSlotDto dto)
    {
        if (CurrentGroupId is not { } gid) return Forbid();
        var slot = await scheduleService.CreateSlotAsync(gid, dto);
        await hub.Clients.Group($"group-{gid}")
            .SendAsync("SlotCreated", new ActivityEventDto(
                CurrentUsername, slot.Label, slot.Date.ToString("yyyy-MM-dd"),
                0, slot.Capacity));
        return CreatedAtAction(nameof(GetDay), new { date = slot.Date }, slot);
    }

    [HttpDelete("slots/{slotId}")]
    [Authorize(Roles = "GroupAdmin,SuperAdmin")]
    public async Task<IActionResult> DeleteSlot(Guid slotId)
    {
        if (CurrentGroupId is not { } gid) return Forbid();
        var slots = await scheduleService.GetDaySlotsAsync(gid, DateOnly.FromDateTime(DateTime.UtcNow), CurrentUserId);
        var slot = slots.FirstOrDefault(s => s.Id == slotId);
        await scheduleService.DeleteSlotAsync(slotId);
        if (slot is not null)
            await hub.Clients.Group($"group-{gid}")
                .SendAsync("SlotDeleted", new ActivityEventDto(
                    CurrentUsername, slot.Label, slot.Date.ToString("yyyy-MM-dd"), 0, slot.Capacity));
        return NoContent();
    }
}
