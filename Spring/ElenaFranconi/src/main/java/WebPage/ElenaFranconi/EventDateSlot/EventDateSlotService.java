package WebPage.ElenaFranconi.EventDateSlot;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Event.EventService;
import WebPage.ElenaFranconi.EventDateSlot.dto.EventDateSlotRequestDto;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import jakarta.transaction.Transactional;

@Service
public class EventDateSlotService {
	@Autowired
	public EventDateSlotRepository eventDateSlotRepository;

	@Autowired
	public EventService eventService;

	// POST METHODS

	@Transactional
	public EventDateSlot createEventDateSlot(EventDateSlotRequestDto body) {
		EventDateSlot eventDateSlot = new EventDateSlot();
		Event event = eventService.findById(body.getEventId());
		eventDateSlot.setDate(body.getDate());
		eventDateSlot.setMaxParticipants(body.getMaxParticipants());
		eventDateSlot.setEvent(event);
		return eventDateSlotRepository.save(eventDateSlot);

	}

	// GET METHODS
	@Transactional
	public EventDateSlot findById(UUID id) {
		return eventDateSlotRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

}
