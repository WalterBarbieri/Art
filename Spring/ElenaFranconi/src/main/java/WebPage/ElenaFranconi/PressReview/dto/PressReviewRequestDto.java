package WebPage.ElenaFranconi.PressReview.dto;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PressReviewRequestDto {
	@NotNull(message = "Content ID is required")
	private UUID contentId;

	@NotBlank(message = "URL is required")
	private String url;

	@NotNull(message = "Image is required")
	private MultipartFile image;

}
