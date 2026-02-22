package WebPage.ElenaFranconi.PressReview.dto;

import java.util.UUID;

import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class PressReviewUpdateDto {
	UUID id;
	@Nullable
	private String url;
	@Nullable
	private MultipartFile image;

}
