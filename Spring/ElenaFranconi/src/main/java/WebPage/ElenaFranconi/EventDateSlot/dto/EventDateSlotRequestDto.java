package WebPage.ElenaFranconi.EventDateSlot.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;

@Data
public class EventDateSlotRequestDto {

	private LocalDate date;
	private int maxParticipants;
	private UUID eventId;

}
