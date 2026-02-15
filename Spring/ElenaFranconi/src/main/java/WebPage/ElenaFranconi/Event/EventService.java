package WebPage.ElenaFranconi.Event;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
import WebPage.ElenaFranconi.Event.dto.EventUpdateDto;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import WebPage.ElenaFranconi.EventDateSlot.dto.EventDateSlotUpdateDto;
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
	public Event editEvent(UUID eventId, EventUpdateDto body) {
		Event event = findEventById(eventId);
		return updateEvent(event, body);
	}

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

	@Transactional
	public Event patchArchived(UUID eventId) {
		Event event = findEventById(eventId);
		if (event.getLinkedCourse() != null) {
			throw new BadRequestException("Cannot archive an event linked to a course. Unlink it first.");
		}
		event.setArchived(!event.isArchived());
		return eventRepository.save(event);
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

	private Event saveEvent(EventRequestDto body) {
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

	private Event updateEvent(Event event, EventUpdateDto body) {
		List<EventDateSlotUpdateDto> existingEventDateSlots = body.getEventDateSlots();
		List<UUID> removedEventDateSlots = body.getRemovedEventDateSlotIds();
		List<LocalDateTime> newEventDateSlots = body.getNewEventDateSlots();
		System.out.println("Existing Event Date Slots: " + existingEventDateSlots);
		System.out.println("Removed Event Date Slot IDs: " + removedEventDateSlots);
		System.out.println("New Event Date Slots: " + newEventDateSlots);

		if (body.getTitle() != null && !body.getTitle().isBlank() && !body.getTitle().equals(event.getTitle())) {
			event.setTitle(body.getTitle());
		}
		if (body.getDescription() != null && !body.getDescription().isBlank()
				&& !body.getDescription().equals(event.getDescription())) {
			event.setDescription(body.getDescription());
		}
		if (body.getLocation() != null && !body.getLocation().isBlank()
				&& !body.getLocation().equals(event.getLocation())) {
			event.setLocation(body.getLocation());
		}
		if (existingEventDateSlots != null && !existingEventDateSlots.isEmpty()) {
			existingEventDateSlots.forEach(slotDto -> event.updateDateSlot(slotDto));
		}
		if (removedEventDateSlots != null && !removedEventDateSlots.isEmpty()) {
			removedEventDateSlots.forEach(slotId -> event.removeDateSlot(slotId));
		}
		if (body.getMaxParticipants() > 0 && body.getMaxParticipants() != event.getMaxParticipants()) {
			event.setMaxParticipants(body.getMaxParticipants());
			event.getDateSlots().forEach(slot -> slot.setMaxParticipants(body.getMaxParticipants()));
		}
		if (newEventDateSlots != null && !newEventDateSlots.isEmpty()) {
			long distinctDatesCount = newEventDateSlots.stream().distinct().count();
			if (distinctDatesCount != newEventDateSlots.size()) {
				throw new BadRequestException("Duplicate dates are not allowed.");
			}
			newEventDateSlots.forEach(date -> {
				EventDateSlot slot = new EventDateSlot();
				slot.setDate(date);
				event.addDateSlot(slot);
			});
		}
		if (body.getInformations() != null && !body.getInformations().isBlank()
				&& !body.getInformations().equals(event.getInformations())) {
			event.setInformations(body.getInformations());
		}
		if (body.getGoogleMapsLink() != null && !body.getGoogleMapsLink().isBlank()
				&& !body.getGoogleMapsLink().equals(event.getGoogleMapsLink())) {
			event.setGoogleMapsLink(body.getGoogleMapsLink());
		}

		Set<LocalDateTime> allDates = event.getDateSlots().stream().map(EventDateSlot::getDate)
				.collect(Collectors.toSet());
		if (allDates.size() != event.getDateSlots().size()) {
			throw new BadRequestException("Duplicate dates are not allowed across all event date slots.");
		}
		if (event.getDateSlots().isEmpty()) {
			throw new BadRequestException("An event must have at least one date slot.");
		}

		refreshContentStatusAndDate(event);

		handleMediaUpdate(event, body);

		return eventRepository.save(event);
	}
}
