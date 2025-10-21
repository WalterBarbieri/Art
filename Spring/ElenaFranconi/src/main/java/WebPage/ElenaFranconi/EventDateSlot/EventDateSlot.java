package WebPage.ElenaFranconi.EventDateSlot;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Recipients.EventRecipient.EventRecipient;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class EventDateSlot {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private LocalDateTime dateTime;

	private int maxParticipants;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "event_id")
	private Event event;

	@OneToMany(mappedBy = "eventDateSlot", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EventRecipient> recipients = new ArrayList<>();

}
