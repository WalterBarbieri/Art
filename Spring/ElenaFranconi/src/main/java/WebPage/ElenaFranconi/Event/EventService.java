package WebPage.ElenaFranconi.Event;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import WebPage.ElenaFranconi.Content.AbstractContentService;
import WebPage.ElenaFranconi.Content.ContentLinkService;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.dto.EventDto;
import WebPage.ElenaFranconi.Event.dto.EventRequestDto;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.PressReview.PressReview;
import WebPage.ElenaFranconi.PressReview.dto.PressReviewDto;

@Service
public class EventService extends AbstractContentService<Event> {
	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private ContentLinkService contentLinkService;

	// POST METHODS

	@Transactional
	public Event createEvent(EventRequestDto body) {
		return saveEvent(body);
	}

	// GET METHODS
	@Transactional(readOnly = true)
	public Event findEventById(UUID id) {
		return eventRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	@Transactional(readOnly = true)
	public List<Event> findAllEvent() {
		return eventRepository.findAll();
	}

	@Transactional(readOnly = true)
	public List<Event> findAllActiveEvent() {
		return eventRepository.findByArchived(false);
	}

	@Transactional(readOnly = true)
	public List<Event> findEventByContentStatusAndActive(ContentStatus contentStatus) {
		return eventRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional(readOnly = true)
	public List<Event> findAllActiveEventSorted() {
		return eventRepository.findAllActiveEventsSorted();
	}

	@Transactional(readOnly = true)
	public List<Event> findAllActiveEventSortedInv() {
		return eventRepository.findAllActiveEventsSortedInv();
	}

	@Transactional(readOnly = true)
	public Page<Event> findActiveEventSortedPaged(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return eventRepository.findActiveEventsSortedPaged(pageable);
	}

	// PATCH METHODS
	@Transactional
	public Event linkToCourse(UUID eventId, UUID courseId) {
		contentLinkService.linkCourseAndEvent(courseId, eventId);
		return findEventById(eventId);
	}

	@Transactional
	public Event unlinkFromCourse(UUID eventId, UUID courseId) {
		contentLinkService.unlinkCourseAndEvent(courseId, eventId);
		return findEventById(eventId);
	}

	// LOGIC METHODS

	public EventDto getEventDto(Event event) {
		List<PressReview> pressReviews = getCombinedPressReviews(event);
		EventDto dto = EventDto.fromEvent(event);
		dto.setPressReviews(PressReviewDto.fromPressReviewList(pressReviews, event.getId()));
		return dto;
	}

	public EventDto getEventDtoById(UUID eventId) {
		Event event = findEventById(eventId);
		return getEventDto(event);
	}

	public Event saveEvent(EventRequestDto body) {
		List<LocalDateTime> dates = body.getEventDates();
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
		event.setInformations(body.getInformations());
		event.setGoogleMapsLink(body.getGoogleMapsLink());

		prepareContent(event);

		Event savedEvent = eventRepository.save(event);

		handleMediaAttachments(savedEvent, body.getCoverImage(), body.getImages(), body.getFiles(), body.getVideos());

		return eventRepository.save(savedEvent);
	}

	public List<PressReview> getCombinedPressReviews(UUID eventId) {
		Event event = findEventById(eventId);
		return getCombinedPressReviews(event);
	}
}
