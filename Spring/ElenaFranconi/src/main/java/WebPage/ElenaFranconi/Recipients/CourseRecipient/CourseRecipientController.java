package WebPage.ElenaFranconi.Recipients.CourseRecipient;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Recipients.CourseRecipient.dto.CourseRecipientDto;
import WebPage.ElenaFranconi.Recipients.CourseRecipient.dto.CourseRecipientRequestDto;

@RestController
@RequestMapping("/api/course-recipients")
public class CourseRecipientController {
	@Autowired
	private CourseRecipientService courseRecipientService;

	// ***************GET METHODS***************
	// FIND BY ID
	@GetMapping("/{id}")
	public ResponseEntity<CourseRecipientDto> getCourseRecipientById(@PathVariable UUID id) {
		CourseRecipient courseRecipient = courseRecipientService.findById(id);
		return ResponseEntity.ok(CourseRecipientDto.fromCourseRecipient(courseRecipient));
	}

	// FIND ALL BY COURSE ID
	@GetMapping("/course/{courseId}")
	public ResponseEntity<List<CourseRecipientDto>> getAllCourseRecipientsByCourse(@PathVariable UUID courseId) {
		List<CourseRecipientDto> recipients = courseRecipientService.findAllByCourse(courseId).stream()
				.map(CourseRecipientDto::fromCourseRecipient).collect(Collectors.toList());
		return ResponseEntity.ok(recipients);
	}
	// *************TEST METHODS*****************
	// *************POST METHODS*****************

	@PostMapping
	public ResponseEntity<CourseRecipientDto> registerCourseRecipient(@RequestBody CourseRecipientRequestDto body) {
		CourseRecipient courseRecipient = courseRecipientService.registerCourseRecipient(body);
		return ResponseEntity.status(HttpStatus.CREATED).body(CourseRecipientDto.fromCourseRecipient(courseRecipient));
	}

	// *************PATCH METHODS*****************

	@PatchMapping("/{id}/unsubscribe")
	public ResponseEntity<Void> unsubscribeCourseRecipient(@PathVariable UUID id) {
		courseRecipientService.unsubscribeCourseRecipient(id);
		return ResponseEntity.noContent().build();
	}

}
