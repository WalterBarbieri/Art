package WebPage.ElenaFranconi.Event;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Event.dto.EventDto;
import WebPage.ElenaFranconi.Event.dto.EventRequestDto;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/event")
public class EventController {
	@Autowired
	private EventService eventService;

	// POST METHODS
	@PreAuthorize("hasAuthority('ADMIN')")
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<EventDto> createEvent(@Valid @ModelAttribute EventRequestDto body) {
		Event savedEvent = eventService.createEvent(body);
		EventDto dto = eventService.getEventDto(savedEvent);
		return ResponseEntity.status(HttpStatus.CREATED).body(dto);
	}

	// GET METHODS
	@GetMapping("/{id}")
	public ResponseEntity<EventDto> getEventById(@PathVariable UUID id) {
		return ResponseEntity.ok(eventService.getEventDtoById(id));
	}

	// PATCH METHODS
	@PatchMapping("/{eventId}/link-course")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<EventDto> linkToCourse(@PathVariable UUID eventId, @RequestParam UUID courseId) {
		Event event = eventService.linkToCourse(eventId, courseId);
		return ResponseEntity.ok(eventService.getEventDto(event));
	}

	@PatchMapping("/{eventId}/unlink-course")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<EventDto> unlinkFromCourse(@PathVariable UUID eventId, @RequestParam UUID courseId) {
		Event event = eventService.unlinkFromCourse(eventId, courseId);
		return ResponseEntity.ok(eventService.getEventDto(event));
	}

	@PatchMapping("/{eventId}/archive")
	@PreAuthorize("hasAuthority('ADMIN')")
	public ResponseEntity<EventDto> archiveEvent(@PathVariable UUID eventId) {
		Event event = eventService.patchArchived(eventId);
		return ResponseEntity.ok(eventService.getEventDto(event));
	}

}
