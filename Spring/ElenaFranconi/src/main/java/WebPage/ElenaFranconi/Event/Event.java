package WebPage.ElenaFranconi.Event;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Recipients.EventRecipient.EventRecipient;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Event extends Content {

	@ElementCollection
	private List<LocalDateTime> eventDates;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EventRecipient> participants = new ArrayList<>();

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EventRecipient> waitingList = new ArrayList<>();

	@OneToOne(mappedBy = "linkedEvent")
	private Course linkedCourse;

	@Override
	public ContentStatus calculateContentStatus() {
		if (eventDates == null || eventDates.isEmpty())
			return ContentStatus.COMPLETED;

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime earliestDate = eventDates.stream().min(LocalDateTime::compareTo).orElse(null);
		LocalDateTime latestDate = eventDates.stream().max(LocalDateTime::compareTo).orElse(null);

		if (earliestDate == null || latestDate == null)
			return ContentStatus.COMPLETED;

		if (now.isBefore(earliestDate))
			return ContentStatus.UPCOMING;
		if (now.isAfter(latestDate))
			return ContentStatus.COMPLETED;
		return ContentStatus.ONGOING;
	}

	@Override
	public LocalDateTime calculateRelevantDate() {
		if (eventDates == null || eventDates.isEmpty())
			return this.getCreatedAt();
		return eventDates.stream().min(LocalDateTime::compareTo).orElse(this.getCreatedAt());
	}

}
