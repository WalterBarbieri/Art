package WebPage.ElenaFranconi.Event.Recipients;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import WebPage.ElenaFranconi.Event.Event;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class EventRecipient {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private String contactName;

	private String email;

	private String phoneNumber;

	private LocalDateTime eventDate;

	private boolean subscribed;

	private String subscribeToken;

	private String unsubscribeToken;

	private boolean subscribeToNewsletter;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "event_id")
	@JsonIgnore
	private Event event;

	public EventRecipient(String contactName, String email, String phoneNumber, LocalDateTime eventDate,
			boolean subscribeToNewsletter) {
		super();
		this.contactName = contactName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.eventDate = eventDate;
		this.subscribed = false;
		this.subscribeToNewsletter = subscribeToNewsletter;
	}

}
