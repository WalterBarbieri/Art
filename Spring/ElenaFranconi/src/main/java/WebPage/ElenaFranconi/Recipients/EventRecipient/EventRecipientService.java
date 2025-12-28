package WebPage.ElenaFranconi.Recipients.EventRecipient;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlotService;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.Recipients.RecipientStatus;
import WebPage.ElenaFranconi.Recipients.EventRecipient.dto.EventRecipientRequestDto;

@Service
public class EventRecipientService {

	@Autowired
	public EventRecipientRepository eventRecipientRepository;

	@Autowired
	public EventDateSlotService eventDateSlotService;

	// GET METHODS
	@Transactional(readOnly = true)
	public EventRecipient findById(UUID id) {
		return eventRecipientRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional(readOnly = true)
	public List<EventRecipient> findAllByEventDateSlot(UUID eventDateSlotId) {
		EventDateSlot eventDateSlot = eventDateSlotService.findById(eventDateSlotId);
		return eventDateSlot.getRecipients();
	}

	// TEST METHODS

	@Transactional
	public EventRecipient registerEventRecipient(EventRecipientRequestDto body) {
		if (body.getNumber() < 1 || body.getNumber() > 5) {
			throw new BadRequestException("Number of participants must be between 1 and 5.");
		}
		if (!body.isPrivacyAccepted()) {
			throw new BadRequestException("Privacy policy must be accepted.");
		}
		EventDateSlot eventDateSlot = eventDateSlotService.findById(body.getEventDateSlotId());
		if (eventDateSlot.getDate().isBefore(LocalDateTime.now())) {
			throw new BadRequestException("Cannot register for an event date slot in the past.");
		}
		Optional<EventRecipient> existingRecipient = eventDateSlot.getRecipients().stream()
				.filter(r -> r.getEmail().equalsIgnoreCase(body.getEmail())).findFirst();
		EventRecipient recipient;

		if (existingRecipient.isPresent()) {
			recipient = existingRecipient.get();
			if (recipient.getStatus() != RecipientStatus.UNSUBSCRIBED) {
				throw new BadRequestException(
						"A recipient with this email is already registered for the event date slot.");
			}
		} else {
			recipient = new EventRecipient();
			populateEventRecipientFromDto(recipient, body);
			recipient.setEventDateSlot(eventDateSlot);
			eventDateSlot.getRecipients().add(recipient);
		}

		recipient.setStatus(RecipientStatus.PENDING);
		this.updateRecipientStatus(eventDateSlot, recipient);
		return eventRecipientRepository.save(recipient);

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
			this.promoteFromWaitingList(eventDateSlot);
			eventRecipientRepository.save(eventRecipient);
			break;
		}
	}

	// HELPER METHODS

	private void populateEventRecipientFromDto(EventRecipient recipient, EventRecipientRequestDto dto) {
		recipient.setName(dto.getName());
		recipient.setSurname(dto.getSurname());
		recipient.setEmail(dto.getEmail());
		recipient.setPhoneNumber(dto.getPhoneNumber());
		recipient.setCity(dto.getCity());
		recipient.setNumber(dto.getNumber());
		recipient.setPrivacyAccepted(dto.isPrivacyAccepted());
		recipient.setSubscribeToNewsletter(dto.isSubscribeToNewsletter());
	}

	private void updateRecipientStatus(EventDateSlot slot, EventRecipient recipient) {
		long confirmedCount = slot.countParticipants();
		recipient.setStatus(
				confirmedCount < slot.getMaxParticipants() ? RecipientStatus.CONFIRMED : RecipientStatus.WAITING);
	}

	private void promoteFromWaitingList(EventDateSlot slot) {
		long confirmedCount = slot.countParticipants();
		List<EventRecipient> waitingRecipients = slot.getRecipients().stream()
				.filter(r -> r.getStatus() == RecipientStatus.WAITING)
				.sorted(Comparator.comparing(EventRecipient::getCreatedAt)).toList();
		for (EventRecipient waiting : waitingRecipients) {
			if (confirmedCount < slot.getMaxParticipants()) {
				waiting.setStatus(RecipientStatus.CONFIRMED);
				eventRecipientRepository.save(waiting);
				confirmedCount += waiting.getNumber();
			} else {
				break;
			}
		}
	}

}
