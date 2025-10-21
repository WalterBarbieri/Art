package WebPage.ElenaFranconi.Recipients.EventRecipient.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Recipients.RecipientStatus;
import WebPage.ElenaFranconi.Recipients.EventRecipient.EventRecipient;
import lombok.Data;

@Data
public class EventRecipientDto {

	private UUID id;
	private String email;
	private boolean privacyAccepted;
	private String subscribeToken;
	private String unsubscribeToken;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private String name;
	private String surname;
	private String phoneNumber;
	private String city;
	private int number;
	private RecipientStatus status;
	private boolean subscribeToNewsletter;

	private UUID eventDateSlotId;

	public static EventRecipientDto fromEventRecipient(EventRecipient recipient) {
		EventRecipientDto dto = new EventRecipientDto();
		dto.setId(recipient.getId());
		dto.setEmail(recipient.getEmail());
		dto.setPrivacyAccepted(recipient.isPrivacyAccepted());
		dto.setSubscribeToken(recipient.getSubscribeToken());
		dto.setUnsubscribeToken(recipient.getUnsubscribeToken());
		dto.setCreatedAt(recipient.getCreatedAt());
		dto.setUpdatedAt(recipient.getUpdatedAt());

		dto.setName(recipient.getName());
		dto.setSurname(recipient.getSurname());
		dto.setPhoneNumber(recipient.getPhoneNumber());
		dto.setCity(recipient.getCity());
		dto.setNumber(recipient.getNumber());
		dto.setStatus(recipient.getStatus());
		dto.setSubscribeToNewsletter(recipient.isSubscribeToNewsletter());

		dto.setEventDateSlotId(recipient.getEventDateSlot() != null ? recipient.getEventDateSlot().getId() : null);

		return dto;
	}

	public static List<EventRecipientDto> fromEventRecipientList(List<EventRecipient> recipients) {
		return recipients.stream().map(EventRecipientDto::fromEventRecipient).toList();
	}
}
