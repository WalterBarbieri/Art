package WebPage.ElenaFranconi.Content;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import WebPage.ElenaFranconi.Content.dto.ContentDto;

@RestController
@RequestMapping("/content")
public class ContentController {

	@Autowired
	private ContentQueryService contentQueryService;

	// READ ONLY CONTROLLER

	@GetMapping("/all")
	public List<ContentDto> getAllActiveContent() {
		List<Content> contents = contentQueryService.findAllActiveContent();
		List<ContentDto> dtos = ContentDto.fromContentList(contents);
		return dtos;
	}

	@GetMapping("/all/sorted")
	public List<ContentDto> getAllActiveContentSorted() {
		List<Content> contents = contentQueryService.findAllActiveContentSorted();
		List<ContentDto> dtos = ContentDto.fromContentList(contents);
		return dtos;
	}

	@GetMapping("/default")
	public List<ContentDto> getTop4ActiveContentSorted() {
		List<Content> contents = contentQueryService.findTop4ActiveSorted();
		List<ContentDto> dtos = ContentDto.fromContentList(contents);
		return dtos;
	}

}
