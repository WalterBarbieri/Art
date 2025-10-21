package WebPage.ElenaFranconi.Course.dto;

import java.time.LocalDate;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CourseRequestDto {
	private String title;
	private String description;
	private LocalDate dateFrom;
	private LocalDate dateTo;
	private String location;
	private int maxParticipants;
	private MultipartFile coverImage;
	@Nullable
	private List<MultipartFile> images;
	@Nullable
	private List<MultipartFile> files;
	@Nullable
	private List<MultipartFile> videos;
}
