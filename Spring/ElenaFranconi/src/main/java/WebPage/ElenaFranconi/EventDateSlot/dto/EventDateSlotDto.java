package WebPage.ElenaFranconi.EventDateSlot.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import lombok.Data;

@Data
public class EventDateSlotDto {
	private UUID id;
	private LocalDateTime date;
	private int maxParticipants;
	private long confirmedParticipants;
	private boolean full;

	public static EventDateSlotDto fromEventDateSlot(EventDateSlot eventDateSlot) {
		EventDateSlotDto dto = new EventDateSlotDto();
		dto.setId(eventDateSlot.getId());
		dto.setDate(eventDateSlot.getDate());
		dto.setMaxParticipants(eventDateSlot.getMaxParticipants());
		dto.setConfirmedParticipants(eventDateSlot.countParticipants());
		dto.setFull(eventDateSlot.isFull());
		return dto;
	}

	public static List<EventDateSlotDto> fromEventDateSlots(List<EventDateSlot> eventDateSlots) {
		return eventDateSlots.stream().map(EventDateSlotDto::fromEventDateSlot).collect(Collectors.toList());
	}

}
