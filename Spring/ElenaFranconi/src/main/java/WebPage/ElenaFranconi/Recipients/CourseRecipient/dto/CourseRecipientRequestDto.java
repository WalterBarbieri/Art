package WebPage.ElenaFranconi.Recipients.CourseRecipient.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseRecipientRequestDto {
	@NotBlank(message = "Name is required.")
	private String name;
	@NotBlank(message = "Surname is required.")
	private String surname;
	@NotBlank(message = "Email is required.")
	private String email;
	@NotBlank(message = "Phone number is required.")
	private String phoneNumber;
	@NotBlank(message = "City is required.")
	private String city;
	@NotBlank(message = "Address is required.")
	private String address;
	@NotBlank(message = "Postal code is required.")
	private String postalCode;
	@NotBlank(message = "Fiscal code is required.")
	private String fiscalCode;
	private boolean privacyAccepted;
	private boolean photoVideoConsent;
	private boolean liabilityRelease;
	private boolean subscribeToNewsletter;
	private UUID courseId;
}
