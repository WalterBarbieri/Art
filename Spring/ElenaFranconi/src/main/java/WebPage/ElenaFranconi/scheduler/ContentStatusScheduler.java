package WebPage.ElenaFranconi.scheduler;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import WebPage.ElenaFranconi.Content.Content;
import WebPage.ElenaFranconi.Content.ContentRepository;
import WebPage.ElenaFranconi.Content.ContentStatus;
import jakarta.transaction.Transactional;

@Component
public class ContentStatusScheduler {
	private final ContentRepository contentRepository;

	public ContentStatusScheduler(ContentRepository contentRepository) {
		this.contentRepository = contentRepository;
	}

	@Scheduled(cron = "0 15 0 * * ?")
	@Transactional
	public void updateContentStatuses() {
		System.out.println("***Running Content Status Update Scheduler...");
		List<Content> contents = contentRepository.findAll();
		for (Content content : contents) {
			ContentStatus currentStatus = content.getContentStatus();
			ContentStatus newStatus = content.calculateContentStatus();

			if (!newStatus.equals(currentStatus)) {
				content.setContentStatus(newStatus);
				contentRepository.save(content);
				System.out.println("***Updated content ID: " + content.getId() + " to status: " + newStatus);
			}
		}
	}

}
