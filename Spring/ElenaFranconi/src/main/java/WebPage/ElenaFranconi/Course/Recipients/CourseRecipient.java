package WebPage.ElenaFranconi.Course.Recipients;

import java.util.UUID;

import WebPage.ElenaFranconi.Course.Course;
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
public class CourseRecipient {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private String name;

	private String surname;

	private String email;

	private String phoneNumber;

	private boolean subscribed;

	private String subscribeToken;

	private String unsubscribeToken;

	private boolean subscribeToNewsletter;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id")
	private Course course;

	public CourseRecipient(String name, String surname, String email, String phoneNumber,
			boolean subscribeToNewsletter) {
		super();
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.subscribed = false;
		this.subscribeToNewsletter = subscribeToNewsletter;
	}

}
