package WebPage.ElenaFranconi.Course;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentStatus;
import WebPage.ElenaFranconi.Event.Event;
import WebPage.ElenaFranconi.Recipients.CourseRecipient.CourseRecipient;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
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
public class Course extends Content {

	private LocalDateTime dateFrom;

	private LocalDateTime dateTo;

	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CourseRecipient> participants = new ArrayList<>();

	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CourseRecipient> waitingList = new ArrayList<>();

	@OneToOne
	@JoinColumn(name = "linked_event_id")
	private Event linkedEvent;

	@Override
	public ContentStatus calculateContentStatus() {
		if (dateFrom == null || dateTo == null)
			return ContentStatus.COMPLETED;
		LocalDateTime now = LocalDateTime.now();

		if (now.isBefore(dateFrom))
			return ContentStatus.UPCOMING;
		if (now.isAfter(dateTo))
			return ContentStatus.COMPLETED;
		return ContentStatus.ONGOING;

	}

	@Override
	public LocalDateTime calculateRelevantDate() {
		if (dateFrom == null)
			return this.getCreatedAt();
		return this.dateFrom;
	}

}
