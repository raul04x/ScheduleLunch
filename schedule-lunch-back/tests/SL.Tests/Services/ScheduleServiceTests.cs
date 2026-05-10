using Moq;
using SL.Application.Services;
using SL.Domain.Entities;
using SL.Domain.Repositories;

namespace SL.Tests.Services;

public class ScheduleServiceTests
{
    private readonly Mock<ITimeSlotRepository> _slotRepo = new();
    private readonly Mock<IAttendanceRepository> _attendanceRepo = new();

    private ScheduleService CreateSut() => new(_slotRepo.Object, _attendanceRepo.Object);

    [Fact]
    public async Task ReserveSlotAsync_Throws_WhenSlotNotFound()
    {
        _slotRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((TimeSlot?)null);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => CreateSut().ReserveSlotAsync(Guid.NewGuid(), Guid.NewGuid()));
    }

    [Fact]
    public async Task ReserveSlotAsync_Throws_WhenSlotFull()
    {
        var slot = new TimeSlot { Id = Guid.NewGuid(), Capacity = 1 };
        slot.Attendances.Add(new Attendance { UserId = Guid.NewGuid(), TimeSlotId = slot.Id, User = new User { Username = "x" } });

        _slotRepo.Setup(r => r.GetByIdAsync(slot.Id)).ReturnsAsync(slot);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => CreateSut().ReserveSlotAsync(slot.Id, Guid.NewGuid()));
    }

    [Fact]
    public async Task ReserveSlotAsync_Throws_WhenAlreadyReserved()
    {
        var userId = Guid.NewGuid();
        var slot = new TimeSlot { Id = Guid.NewGuid(), Capacity = 5 };

        _slotRepo.Setup(r => r.GetByIdAsync(slot.Id)).ReturnsAsync(slot);
        _attendanceRepo.Setup(r => r.ExistsAsync(userId, slot.Id)).ReturnsAsync(true);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => CreateSut().ReserveSlotAsync(slot.Id, userId));
    }
}
