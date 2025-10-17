package WebPage.ElenaFranconi.Course.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CourseRequestDto {
	private String title;
	private String description;
	private LocalDateTime dateFrom;
	private LocalDateTime dateTo;
	private String location;
	private MultipartFile coverImage;
	private List<MultipartFile> images;
	private List<MultipartFile> files;
	private List<MultipartFile> videos;
}
