package WebPage.ElenaFranconi.Recipients.EventRecipient;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Recipients.EventRecipient.dto.EventRecipientDto;
import WebPage.ElenaFranconi.Recipients.EventRecipient.dto.EventRecipientRequestDto;

@RestController
@RequestMapping("/api/event-recipients")
public class EventRecipientController {
	@Autowired
	private EventRecipientService eventRecipientService;

	// ***************GET METHODS***************
	// FIND BY ID
	@GetMapping("/{id}")
	public ResponseEntity<EventRecipientDto> getEventRecipientById(@PathVariable UUID id) {
		EventRecipient eventRecipient = eventRecipientService.findById(id);
		return ResponseEntity.ok(EventRecipientDto.fromEventRecipient(eventRecipient));
	}

	// FIND ALL BY EVENT DATE SLOT ID
	@GetMapping("/event-date-slot/{eventDateSlotId}")
	public ResponseEntity<List<EventRecipientDto>> getAllEventRecipientsByEventDateSlot(
			@PathVariable UUID eventDateSlotId) {
		List<EventRecipientDto> recipients = eventRecipientService.findAllByEventDateSlot(eventDateSlotId).stream()
				.map(EventRecipientDto::fromEventRecipient).collect(Collectors.toList());
		return ResponseEntity.ok(recipients);
	}

	// *************TEST METHODS*****************
	// *************POST METHODS*****************
	@PostMapping
	public ResponseEntity<EventRecipientDto> registerEventRecipient(@RequestBody EventRecipientRequestDto body) {
		EventRecipient eventRecipient = eventRecipientService.registerEventRecipient(body);
		return ResponseEntity.status(HttpStatus.CREATED).body(EventRecipientDto.fromEventRecipient(eventRecipient));
	}

	// *************PATCH METHODS*****************
	@PatchMapping("/{id}/unsubscribe")
	public ResponseEntity<Void> unsubscribeEventRecipient(@PathVariable UUID id) {
		eventRecipientService.unsubscribeEventRecipient(id);
		return ResponseEntity.noContent().build();
	}

}
