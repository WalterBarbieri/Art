package WebPage.ElenaFranconi.EventDateSlot;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import WebPage.ElenaFranconi.Event.EventService;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;

@Service
public class EventDateSlotService {
	@Autowired
	public EventDateSlotRepository eventDateSlotRepository;

	@Autowired
	public EventService eventService;

	// GET METHODS
	@Transactional(readOnly = true)
	public EventDateSlot findById(UUID id) {
		return eventDateSlotRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

}
