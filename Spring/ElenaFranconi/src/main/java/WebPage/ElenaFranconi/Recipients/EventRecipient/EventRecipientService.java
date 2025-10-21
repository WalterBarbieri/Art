package WebPage.ElenaFranconi.Recipients.EventRecipient;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlotService;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.Recipients.RecipientStatus;
import WebPage.ElenaFranconi.Recipients.EventRecipient.dto.EventRecipientRequestDto;
import jakarta.transaction.Transactional;

@Service
public class EventRecipientService {

	@Autowired
	public EventRecipientRepository eventRecipientRepository;

	@Autowired
	public EventDateSlotService eventDateSlotService;

	// GET METHODS
	@Transactional
	public EventRecipient findById(UUID id) {
		return eventRecipientRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional
	public List<EventRecipient> findAllByEventDateSlot(UUID eventDateSlotId) {
		EventDateSlot eventDateSlot = eventDateSlotService.findById(eventDateSlotId);
		return eventDateSlot.getRecipients();
	}

	// TEST METHODS

	@Transactional
	public EventRecipient registerEventRecipient(EventRecipientRequestDto body) {
		if (body.getNumber() < 1 || body.getNumber() > 5) {
			throw new IllegalArgumentException("Number of participants must be between 1 and 5.");
		}
		EventDateSlot eventDateSlot = eventDateSlotService.findById(body.getEventDateSlotId());
		long confirmedCount = eventDateSlot.getRecipients().stream()
				.filter(r -> r.getStatus() == RecipientStatus.CONFIRMED).mapToLong(r -> r.getNumber()).sum();
		EventRecipient eventRecipient = new EventRecipient();
		eventRecipient.setName(body.getName());
		eventRecipient.setSurname(body.getSurname());
		eventRecipient.setEmail(body.getEmail());
		eventRecipient.setPhoneNumber(body.getPhoneNumber());
		eventRecipient.setCity(body.getCity());
		eventRecipient.setNumber(body.getNumber());
		eventRecipient.setPrivacyAccepted(body.isPrivacyAccepted());
		eventRecipient.setSubscribeToNewsletter(body.isSubscribeToNewsletter());
		eventRecipient.setStatus(RecipientStatus.PENDING);
		eventRecipient.setEventDateSlot(eventDateSlot);

		if (confirmedCount <= eventDateSlot.getMaxParticipants()) {
			eventRecipient.setStatus(RecipientStatus.CONFIRMED);
		} else {
			eventRecipient.setStatus(RecipientStatus.WAITING);
		}
		eventDateSlot.getRecipients().add(eventRecipient);
		return eventRecipientRepository.save(eventRecipient);

	}

	@Transactional
	public void unsubscribeEventRecipient(UUID id) {
		EventRecipient eventRecipient = this.findById(id);

		switch (eventRecipient.getStatus()) {
		case UNSUBSCRIBED:
			throw new IllegalStateException("Recipient is already unsubscribed.");
		case PENDING:
			eventRecipient.setStatus(RecipientStatus.UNSUBSCRIBED);
			eventRecipientRepository.save(eventRecipient);
			break;
		case CONFIRMED, WAITING:
			EventDateSlot eventDateSlot = eventDateSlotService.findById(eventRecipient.getEventDateSlot().getId());
			eventRecipient.setStatus(RecipientStatus.UNSUBSCRIBED);
			long confirmedCount = eventDateSlot.getRecipients().stream()
					.filter(r -> r.getStatus() == RecipientStatus.CONFIRMED).mapToLong(r -> r.getNumber()).sum();
			eventDateSlot.getRecipients().stream().filter(r -> r.getStatus() == RecipientStatus.WAITING).findFirst()
					.ifPresent(waitingRecipient -> {
						if (confirmedCount < eventDateSlot.getMaxParticipants()) {
							waitingRecipient.setStatus(RecipientStatus.CONFIRMED);
							eventRecipientRepository.save(waitingRecipient);
						}
					});
			eventRecipientRepository.save(eventRecipient);
			break;
		}
	}

}
