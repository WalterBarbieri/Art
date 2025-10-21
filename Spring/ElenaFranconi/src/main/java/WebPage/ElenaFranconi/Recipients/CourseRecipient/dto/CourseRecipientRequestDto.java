package WebPage.ElenaFranconi.Recipients.CourseRecipient.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class CourseRecipientRequestDto {

	private String name;
	private String surname;
	private String email;
	private String phoneNumber;
	private String city;
	private String address;
	private String postalCode;
	private String fiscalCode;
	private boolean privacyAccepted;
	private boolean photoVideoConsent;
	private boolean liabilityRelease;
	private boolean subscribeToNewsletter;
	private UUID courseId;
}
