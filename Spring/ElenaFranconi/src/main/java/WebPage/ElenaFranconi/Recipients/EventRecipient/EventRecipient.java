package WebPage.ElenaFranconi.Recipients.EventRecipient;

import java.time.LocalDateTime;

import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Recipients.Recipient;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EventRecipient extends Recipient {

	private String name;

	private String surname;

	private String phoneNumber;

	private String city;

	private LocalDateTime eventDate;

	private boolean subscribeToNewsletter;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "event_id")
	private Event event;

}
