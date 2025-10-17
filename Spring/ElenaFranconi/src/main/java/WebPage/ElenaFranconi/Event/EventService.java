package WebPage.ElenaFranconi.Event;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Content.AbstractContentService;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.dto.EventRequestDto;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import jakarta.transaction.Transactional;

@Service
public class EventService extends AbstractContentService<Event> {
	@Autowired
	private EventRepository eventRepository;

	// POST METHODS

	@Transactional
	public Event createEvent(EventRequestDto body) {
		return saveEvent(body);
	}

	// GET METHODS
	@Transactional
	public Event findById(UUID id) {
		return eventRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional
	public List<Event> findAll() {
		return eventRepository.findAll();
	}

	@Transactional
	public List<Event> findAllActive() {
		return eventRepository.findByArchived(false);
	}

	@Transactional
	public List<Event> findByContentStatusAndActive(ContentStatus contentStatus) {
		return eventRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional
	public List<Event> findAllActiveSorted() {
		return eventRepository.findAllActiveEventsSorted();
	}

	@Transactional
	public List<Event> findAllActiveSortedInv() {
		return eventRepository.findAllActiveEventsSortedInv();
	}

	// LOGIC METHODS
	public Event saveEvent(EventRequestDto body) {
		Event event = new Event();
		event.setTitle(body.getTitle());
		event.setDescription(body.getDescription());
		event.setEventDates(body.getEventDates());
		event.setLocation(body.getLocation());

		prepareContent(event);

		event = eventRepository.save(event);

		handleMediaAttachments(event, body.getCoverImage(), body.getImages(), body.getFiles(), body.getVideos());

		return eventRepository.save(event);
	}

}
