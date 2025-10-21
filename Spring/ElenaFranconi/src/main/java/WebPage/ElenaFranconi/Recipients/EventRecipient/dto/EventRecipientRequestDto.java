package WebPage.ElenaFranconi.Recipients.EventRecipient.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class EventRecipientRequestDto {
	private String name;
	private String surname;
	private String email;
	private String phoneNumber;
	private String city;
	private int number;
	private boolean privacyAccepted;
	private boolean subscribeToNewsletter;
	private UUID eventDateSlotId;
}
