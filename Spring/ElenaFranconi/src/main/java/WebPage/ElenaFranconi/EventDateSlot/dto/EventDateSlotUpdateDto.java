package WebPage.ElenaFranconi.EventDateSlot.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class EventDateSlotUpdateDto {

	private UUID id;

	private LocalDateTime date;

}
