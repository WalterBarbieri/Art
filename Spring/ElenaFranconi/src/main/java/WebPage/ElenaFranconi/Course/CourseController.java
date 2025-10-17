package WebPage.ElenaFranconi.Course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Course.dto.CourseDto;
import WebPage.ElenaFranconi.Course.dto.CourseRequestDto;

@RestController
@RequestMapping("/api/course")
public class CourseController {
	@Autowired
	private CourseService courseService;

	// POST METHODS
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<CourseDto> createCourse(@ModelAttribute CourseRequestDto body) {
		Course savedCourse = courseService.createCourse(body);
		CourseDto dto = CourseDto.fromCourse(savedCourse);
		return ResponseEntity.status(HttpStatus.CREATED).body(dto);
	}
}
