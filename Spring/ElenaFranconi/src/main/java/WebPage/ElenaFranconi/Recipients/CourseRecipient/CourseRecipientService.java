package WebPage.ElenaFranconi.Recipients.CourseRecipient;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Course.CourseRepository;
import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.Recipients.RecipientStatus;
import WebPage.ElenaFranconi.Recipients.CourseRecipient.dto.CourseRecipientRequestDto;
import jakarta.transaction.Transactional;

@Service
public class CourseRecipientService {

	@Autowired
	private CourseRecipientRepository courseRecipientRepository;

	@Autowired
	private CourseRepository courseRepository;

	// GET METHODS

	@Transactional
	public CourseRecipient findById(UUID id) {
		return courseRecipientRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
	}

	// TEST METHODS

	@Transactional
	public CourseRecipient registerCourseRecipient(CourseRecipientRequestDto body) {
		Course course = courseRepository.findById(body.getCourseId())
				.orElseThrow(() -> new NotFoundException(body.getCourseId()));
		CourseRecipient courseRecipient = new CourseRecipient();
		courseRecipient.setName(body.getName());
		courseRecipient.setSurname(body.getSurname());
		courseRecipient.setEmail(body.getEmail());
		courseRecipient.setPhoneNumber(body.getPhoneNumber());
		courseRecipient.setCity(body.getCity());
		courseRecipient.setAddress(body.getAddress());
		courseRecipient.setPostalCode(body.getPostalCode());
		courseRecipient.setFiscalCode(body.getFiscalCode());
		courseRecipient.setPrivacyAccepted(body.isPrivacyAccepted());
		courseRecipient.setPhotoVideoConsent(body.isPhotoVideoConsent());
		courseRecipient.setLiabilityRelease(body.isLiabilityRelease());
		courseRecipient.setSubscribeToNewsletter(body.isSubscribeToNewsletter());
		courseRecipient.setStatus(RecipientStatus.PENDING);
		courseRecipient.setCourse(course);

		long confirmedCount = course.getRecipients().stream().filter(r -> r.getStatus() == RecipientStatus.CONFIRMED)
				.count();

		if (confirmedCount < course.getMaxParticipants()) {
			courseRecipient.setStatus(RecipientStatus.CONFIRMED);
		} else {
			courseRecipient.setStatus(RecipientStatus.WAITING);
		}

		course.getRecipients().add(courseRecipient);
		return courseRecipientRepository.save(courseRecipient);
	}

	@Transactional
	public void unsubscribeCourseRecipient(UUID courseRecipientId) {
		CourseRecipient courseRecipient = this.findById(courseRecipientId);

		switch (courseRecipient.getStatus()) {
		case UNSUBSCRIBED:
			throw new IllegalStateException("Recipient is already unsubscribed.");
		case PENDING:
			courseRecipient.setStatus(RecipientStatus.UNSUBSCRIBED);
			courseRecipientRepository.save(courseRecipient);
			break;
		case CONFIRMED, WAITING:
			Course course = courseRecipient.getCourse();
			courseRecipient.setStatus(RecipientStatus.UNSUBSCRIBED);
			long confirmedCount = course.getRecipients().stream()
					.filter(r -> r.getStatus() == RecipientStatus.CONFIRMED).count();
			course.getRecipients().stream().filter(r -> r.getStatus() == RecipientStatus.WAITING).findFirst()
					.ifPresent(waitingRecipient -> {
						if (confirmedCount < course.getMaxParticipants()) {
							waitingRecipient.setStatus(RecipientStatus.CONFIRMED);
						}
					});
			courseRecipientRepository.save(courseRecipient);
			break;

		}

	}

}
