package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EventRequestDto {
	private String title;
	private String description;
	private List<LocalDateTime> eventDates;
	private String location;
	private MultipartFile coverImage;
	private List<MultipartFile> images;
	private List<MultipartFile> files;
	private List<MultipartFile> videos;
}
