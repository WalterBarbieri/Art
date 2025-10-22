package WebPage.ElenaFranconi.Recipients.CourseRecipient;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Course.Course;
import WebPage.ElenaFranconi.Course.CourseRepository;
import WebPage.ElenaFranconi.Exceptions.BadRequestException;
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

	@Transactional
	public List<CourseRecipient> findAllByCourse(UUID courseId) {
		Course course = courseRepository.findById(courseId).orElseThrow(() -> new NotFoundException(courseId));
		return course.getRecipients();
	}

	// TEST METHODS

	@Transactional
	public CourseRecipient registerCourseRecipient(CourseRecipientRequestDto body) {
		Course course = courseRepository.findById(body.getCourseId())
				.orElseThrow(() -> new NotFoundException(body.getCourseId()));
		if (course.getDateFrom().isBefore(LocalDate.now()))
			throw new BadRequestException("Cannot register for a course in the past.");
		this.validateCourseRecipient(body);
		Optional<CourseRecipient> existingRecipient = course.getRecipients().stream()
				.filter(r -> r.getEmail().equalsIgnoreCase(body.getEmail())).findFirst();
		CourseRecipient recipient;
		if (existingRecipient.isPresent()) {
			recipient = existingRecipient.get();
			if (recipient.getStatus() != RecipientStatus.UNSUBSCRIBED) {
				throw new BadRequestException("A recipient with this email is already registered for the course.");
			}
		} else {
			recipient = new CourseRecipient();
			this.populateCourseRecipientFromDto(recipient, body);
			recipient.setCourse(course);
			course.getRecipients().add(recipient);
		}

		recipient.setStatus(RecipientStatus.PENDING);
		this.updateRecipientStatus(course, recipient);
		return courseRecipientRepository.save(recipient);
	}

	@Transactional
	public void unsubscribeCourseRecipient(UUID courseRecipientId) {
		CourseRecipient courseRecipient = this.findById(courseRecipientId);

		switch (courseRecipient.getStatus()) {
		case UNSUBSCRIBED:
			throw new BadRequestException("Recipient is already unsubscribed.");
		case PENDING:
			courseRecipient.setStatus(RecipientStatus.UNSUBSCRIBED);
			courseRecipientRepository.save(courseRecipient);
			break;
		case CONFIRMED, WAITING:
			Course course = courseRecipient.getCourse();
			courseRecipient.setStatus(RecipientStatus.UNSUBSCRIBED);
			this.promoteFromWaitingList(course);
			courseRecipientRepository.save(courseRecipient);
			break;

		}

	}

	// HELPER METHODS

	private void validateCourseRecipient(CourseRecipientRequestDto body) {
		isPrivacyAccepted(body);
		isLiabilityReleaseAccepted(body);
		isPhotoVideoConsentAccepted(body);
	}

	private void isPrivacyAccepted(CourseRecipientRequestDto body) {
		if (!body.isPrivacyAccepted()) {
			throw new BadRequestException("Privacy policy must be accepted.");
		}
	}

	private void isLiabilityReleaseAccepted(CourseRecipientRequestDto body) {
		if (!body.isLiabilityRelease()) {
			throw new BadRequestException("Liability release must be accepted.");
		}
	}

	private void isPhotoVideoConsentAccepted(CourseRecipientRequestDto body) {
		if (!body.isPhotoVideoConsent()) {
			throw new BadRequestException("Photo and video consent must be accepted.");
		}
	}

	private void populateCourseRecipientFromDto(CourseRecipient recipient, CourseRecipientRequestDto dto) {
		recipient.setName(dto.getName());
		recipient.setSurname(dto.getSurname());
		recipient.setEmail(dto.getEmail());
		recipient.setPhoneNumber(dto.getPhoneNumber());
		recipient.setCity(dto.getCity());
		recipient.setAddress(dto.getAddress());
		recipient.setPostalCode(dto.getPostalCode());
		recipient.setFiscalCode(dto.getFiscalCode());
		recipient.setPrivacyAccepted(dto.isPrivacyAccepted());
		recipient.setPhotoVideoConsent(dto.isPhotoVideoConsent());
		recipient.setLiabilityRelease(dto.isLiabilityRelease());
		recipient.setSubscribeToNewsletter(dto.isSubscribeToNewsletter());
	}

	private void updateRecipientStatus(Course course, CourseRecipient recipient) {
		long confirmedCount = course.countParticipants();
		recipient.setStatus(
				confirmedCount < course.getMaxParticipants() ? RecipientStatus.CONFIRMED : RecipientStatus.WAITING);
	}

	private void promoteFromWaitingList(Course course) {
		long confirmedCount = course.countParticipants();

		List<CourseRecipient> waitingRecipients = course.getRecipients().stream()
				.filter(r -> r.getStatus() == RecipientStatus.WAITING)
				.sorted(Comparator.comparing(CourseRecipient::getCreatedAt)).toList();

		for (CourseRecipient waiting : waitingRecipients) {
			if (confirmedCount < course.getMaxParticipants()) {
				waiting.setStatus(RecipientStatus.CONFIRMED);
				courseRecipientRepository.save(waiting);
				confirmedCount++;
			} else {
				break;
			}
		}
	}

}
