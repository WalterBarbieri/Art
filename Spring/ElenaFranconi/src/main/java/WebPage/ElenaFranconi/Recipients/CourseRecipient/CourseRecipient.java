package WebPage.ElenaFranconi.Recipients.CourseRecipient;

import WebPage.ElenaFranconi.Course.Course;
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
public class CourseRecipient extends Recipient {

	private String name;

	private String surname;

	private String phoneNumber;

	private String city;

	private String address;

	private String postalCode;

	private String fiscalCode;

	private boolean photoVideoConsent;

	private boolean liabilityRelease;

	private boolean subscribeToNewsletter;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_id")
	private Course course;

}
