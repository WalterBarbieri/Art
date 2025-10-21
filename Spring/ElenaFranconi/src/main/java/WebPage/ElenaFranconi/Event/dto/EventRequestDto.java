package WebPage.ElenaFranconi.Event.dto;

import java.time.LocalDate;
import java.util.List;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class EventRequestDto {
	private String title;
	private String description;
	private List<LocalDate> eventDates;
	private int maxParticipants;
	private String location;
	private MultipartFile coverImage;
	@Nullable
	private List<MultipartFile> images;
	@Nullable
	private List<MultipartFile> files;
	@Nullable
	private List<MultipartFile> videos;
}
