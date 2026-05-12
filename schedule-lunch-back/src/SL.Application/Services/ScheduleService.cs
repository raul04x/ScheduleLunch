using SL.Application.DTOs;
using SL.Application.Interfaces;
using SL.Domain.Entities;
using SL.Domain.Repositories;

namespace SL.Application.Services;

public class ScheduleService(ITimeSlotRepository slotRepo, IAttendanceRepository attendanceRepo) : IScheduleService
{
    public async Task<IEnumerable<TimeSlotDto>> GetWeekSlotsAsync(Guid groupId, Guid currentUserId, DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.Now);
        var dow = (int)today.DayOfWeek;
        var monday = today.AddDays(dow == 0 ? -6 : -(dow - 1));
        var friday = monday.AddDays(4);

        var slots = await slotRepo.GetByGroupAndRangeAsync(groupId, monday, friday);
        return slots.Select(s => MapToDto(s, currentUserId));
    }

    public async Task<IEnumerable<TimeSlotDto>> GetDaySlotsAsync(Guid groupId, DateOnly date, Guid currentUserId)
    {
        var slots = await slotRepo.GetByGroupAndRangeAsync(groupId, date, date);
        return slots.Select(s => MapToDto(s, currentUserId));
    }

    public async Task<TimeSlotDto> ReserveSlotAsync(Guid slotId, Guid userId)
    {
        var slot = await slotRepo.GetByIdAsync(slotId)
            ?? throw new InvalidOperationException("Slot not found");

        if (slot.Attendances.Count >= slot.Capacity)
            throw new InvalidOperationException("Slot is full");

        if (await attendanceRepo.ExistsAsync(userId, slotId))
            throw new InvalidOperationException("Already reserved");

        await attendanceRepo.AddAsync(new Attendance { UserId = userId, TimeSlotId = slotId });

        var updated = await slotRepo.GetByIdAsync(slotId);
        return MapToDto(updated!, userId);
    }

    public async Task<TimeSlotDto> CancelReservationAsync(Guid slotId, Guid userId)
    {
        await attendanceRepo.DeleteAsync(userId, slotId);
        var updated = await slotRepo.GetByIdAsync(slotId);
        return MapToDto(updated!, userId);
    }

    public async Task<TimeSlotDto> CreateSlotAsync(Guid groupId, CreateTimeSlotDto dto)
    {
        var slot = new TimeSlot
        {
            GroupId = groupId,
            Date = dto.Date,
            Label = dto.Label,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Capacity = dto.Capacity
        };

        await slotRepo.AddAsync(slot);
        var created = await slotRepo.GetByIdAsync(slot.Id);
        return MapToDto(created!, Guid.Empty);
    }

    public Task DeleteSlotAsync(Guid slotId) => slotRepo.DeleteAsync(slotId);

    private static TimeSlotDto MapToDto(TimeSlot slot, Guid currentUserId) =>
        new(slot.Id, slot.GroupId, slot.Date, slot.Label, slot.StartTime, slot.EndTime,
            slot.Capacity, slot.Attendances.Count,
            slot.Attendances.Any(a => a.UserId == currentUserId),
            slot.Attendances.Select(a => new AttendeeDto(a.UserId, a.User.Username, $"{a.User.FirstName} {a.User.LastName}".Trim())));
}
