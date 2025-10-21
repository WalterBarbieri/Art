package WebPage.ElenaFranconi.Recipients.CourseRecipient.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import WebPage.ElenaFranconi.Recipients.RecipientStatus;
import WebPage.ElenaFranconi.Recipients.CourseRecipient.CourseRecipient;
import lombok.Data;

@Data
public class CourseRecipientDto {

	private UUID id;
	private String email;
	private String name;
	private String surname;
	private String phoneNumber;
	private String city;
	private String address;
	private String postalCode;
	private String fiscalCode;
	private RecipientStatus status;
	private boolean photoVideoConsent;
	private boolean liabilityRelease;
	private boolean subscribeToNewsletter;
	private boolean privacyAccepted;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private UUID courseId;

	public static CourseRecipientDto fromCourseRecipient(CourseRecipient recipient) {
		CourseRecipientDto dto = new CourseRecipientDto();
		dto.setId(recipient.getId());
		dto.setEmail(recipient.getEmail());
		dto.setPrivacyAccepted(recipient.isPrivacyAccepted());
		dto.setCreatedAt(recipient.getCreatedAt());
		dto.setUpdatedAt(recipient.getUpdatedAt());

		dto.setName(recipient.getName());
		dto.setSurname(recipient.getSurname());
		dto.setPhoneNumber(recipient.getPhoneNumber());
		dto.setCity(recipient.getCity());
		dto.setAddress(recipient.getAddress());
		dto.setPostalCode(recipient.getPostalCode());
		dto.setFiscalCode(recipient.getFiscalCode());
		dto.setStatus(recipient.getStatus());
		dto.setPhotoVideoConsent(recipient.isPhotoVideoConsent());
		dto.setLiabilityRelease(recipient.isLiabilityRelease());
		dto.setSubscribeToNewsletter(recipient.isSubscribeToNewsletter());

		dto.setCourseId(recipient.getCourse() != null ? recipient.getCourse().getId() : null);

		return dto;
	}

	public static List<CourseRecipientDto> fromCourseRecipientList(List<CourseRecipient> recipients) {
		return recipients.stream().map(CourseRecipientDto::fromCourseRecipient).toList();
	}

}
