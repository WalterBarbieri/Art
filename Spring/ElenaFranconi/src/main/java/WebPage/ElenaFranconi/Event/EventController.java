package WebPage.ElenaFranconi.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Event.dto.EventDto;
import WebPage.ElenaFranconi.Event.dto.EventRequestDto;

@RestController
@RequestMapping("/api/event")
public class EventController {
	@Autowired
	private EventService eventService;

	// POST METHODS
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<EventDto> createEvent(@ModelAttribute EventRequestDto body) {
		Event savedEvent = eventService.createEvent(body);
		EventDto dto = EventDto.fromEvent(savedEvent);
		return ResponseEntity.status(HttpStatus.CREATED).body(dto);
	}

}
