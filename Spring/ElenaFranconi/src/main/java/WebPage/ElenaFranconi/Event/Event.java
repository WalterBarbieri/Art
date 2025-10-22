package WebPage.ElenaFranconi.Event;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.EventDateSlot.EventDateSlot;
import WebPage.ElenaFranconi.PressReview.PressReview;
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

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PressReview> pressReviews = new ArrayList<>();

	@Override
	public ContentStatus calculateContentStatus() {
		if (dateSlots == null || dateSlots.isEmpty())
			return ContentStatus.COMPLETED;

		List<LocalDate> dates = dateSlots.stream().map(EventDateSlot::getDate).toList();

		LocalDate now = LocalDate.now();
		LocalDate earliestDate = dates.stream().min(LocalDate::compareTo).orElse(null);
		LocalDate latestDate = dates.stream().max(LocalDate::compareTo).orElse(null);

		if (earliestDate == null || latestDate == null)
			return ContentStatus.COMPLETED;

		if (now.isBefore(earliestDate))
			return ContentStatus.UPCOMING;
		if (now.isAfter(latestDate))
			return ContentStatus.COMPLETED;
		return ContentStatus.ONGOING;
	}

	@Override
	public LocalDate calculateRelevantDate() {
		if (dateSlots == null || dateSlots.isEmpty())
			return this.getCreatedAt().toLocalDate();
		return dateSlots.stream().map(EventDateSlot::getDate).min(LocalDate::compareTo)
				.orElse(this.getCreatedAt().toLocalDate());
	}

	public void addDateSlot(EventDateSlot slot) {
		slot.setEvent(this);
		slot.setMaxParticipants(this.getMaxParticipants());
		this.dateSlots.add(slot);
	}

}
