package WebPage.ElenaFranconi.Content.Media;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface MediaUpdateDto {
	MultipartFile getCoverImage();

	List<MultipartFile> getImages();

	List<MultipartFile> getFiles();

	List<MultipartFile> getVideos();

	List<String> getRemovedImages();

	List<String> getRemovedFiles();

	List<String> getRemovedVideos();
}
