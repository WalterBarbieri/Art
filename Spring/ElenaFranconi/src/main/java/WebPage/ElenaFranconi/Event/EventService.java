package WebPage.ElenaFranconi.Event;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Content.AbstractContentService;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.dto.EventRequestDto;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
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
	public Event findEventById(UUID id) {
		return eventRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional
	public List<Event> findAllEvent() {
		return eventRepository.findAll();
	}

	@Transactional
	public List<Event> findAllActiveEvent() {
		return eventRepository.findByArchived(false);
	}

	@Transactional
	public List<Event> findEventByContentStatusAndActive(ContentStatus contentStatus) {
		return eventRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional
	public List<Event> findAllActiveEventSorted() {
		return eventRepository.findAllActiveEventsSorted();
	}

	@Transactional
	public List<Event> findAllActiveEventSortedInv() {
		return eventRepository.findAllActiveEventsSortedInv();
	}

	@Transactional
	public Page<Event> findActiveEventSortedPaged(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return eventRepository.findActiveEventsSortedPaged(pageable);
	}

	// LOGIC METHODS
	public Event saveEvent(EventRequestDto body) {
		List<LocalDate> dates = body.getEventDates();
		long distinctDatesCount = dates.stream().distinct().count();
		if (distinctDatesCount != dates.size()) {
			throw new BadRequestException("Duplicate dates are not allowed.");
		}
		if (dates.isEmpty()) {
			throw new BadRequestException("At least one date must be provided.");
		}
		Event event = new Event();
		event.setTitle(body.getTitle());
		event.setDescription(body.getDescription());
		event.setLocation(body.getLocation());
		event.setMaxParticipants(body.getMaxParticipants());
		dates.forEach(date -> {
			EventDateSlot slot = new EventDateSlot();
			slot.setDate(date);
			event.addDateSlot(slot);
		});

		prepareContent(event);

		Event savedEvent = eventRepository.save(event);

		handleMediaAttachments(savedEvent, body.getCoverImage(), body.getImages(), body.getFiles(), body.getVideos());

		return eventRepository.save(savedEvent);
	}

}
