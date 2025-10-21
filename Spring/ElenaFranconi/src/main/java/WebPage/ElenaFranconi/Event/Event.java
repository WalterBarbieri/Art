package WebPage.ElenaFranconi.Event;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import jakarta.persistence.CascadeType;
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

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EventDateSlot> dateSlots = new ArrayList<>();

	@OneToOne(mappedBy = "linkedEvent")
	private Course linkedCourse;

	@Override
	public ContentStatus calculateContentStatus() {
		if (dateSlots == null || dateSlots.isEmpty())
			return ContentStatus.COMPLETED;

		List<LocalDateTime> dates = dateSlots.stream().map(EventDateSlot::getDateTime).toList();

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime earliestDate = dates.stream().min(LocalDateTime::compareTo).orElse(null);
		LocalDateTime latestDate = dates.stream().max(LocalDateTime::compareTo).orElse(null);

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
		if (dateSlots == null || dateSlots.isEmpty())
			return this.getCreatedAt();
		return dateSlots.stream().map(EventDateSlot::getDateTime).min(LocalDateTime::compareTo)
				.orElse(this.getCreatedAt());
	}

	public void addDateSlot(EventDateSlot slot) {
		slot.setEvent(this);
		this.dateSlots.add(slot);
	}

}
