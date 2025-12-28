package WebPage.ElenaFranconi.EventDateSlot.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class EventDateSlotRequestDto {

	private LocalDateTime date;
	private int maxParticipants;
	private UUID eventId;

}
