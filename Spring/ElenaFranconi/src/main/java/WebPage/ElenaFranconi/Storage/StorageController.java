package WebPage.ElenaFranconi.Storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/storage")
public class StorageController {
	@Autowired
	private StorageService storageService;

	@GetMapping("/{contentId}/{fileType}/{fileName:.+}")
	public ResponseEntity<Resource> getFile(@PathVariable UUID contentId, @PathVariable String fileType,
			@PathVariable String fileName) {

		FileType type;
		try {
			type = FileType.fromString(fileType);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(null);
		}

		String relativePath = Paths.get("content", contentId.toString(), type.getDirectoryName(), fileName).toString();

		try {
			Path filePath = storageService.loadFile(relativePath);
			Resource resource = new UrlResource(filePath.toUri());

			if (!resource.exists() || !resource.isReadable()) {
				return ResponseEntity.notFound().build();
			}

			String contentType = Files.probeContentType(filePath);
			if (contentType == null) {
				contentType = "application/octet-stream";
			}

			String dispositionType = switch (type) {
			case IMAGE -> "inline";
			case VIDEO -> "inline";
			case FILE -> "attachment";
			};

			String contentDisposition = dispositionType + "; filename=\"" + resource.getFilename() + "\"";

			return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
					.contentType(MediaType.parseMediaType(contentType)).body(resource);

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
