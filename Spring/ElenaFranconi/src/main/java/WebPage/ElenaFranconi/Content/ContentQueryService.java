package WebPage.ElenaFranconi.Content;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ContentQueryService {
	@Autowired
	private ContentRepository contentRepository;

	// GET METHODS
	@Transactional
	public List<Content> findAllActiveContent() {
		return contentRepository.findByArchived(false);
	}

	@Transactional
	public List<Content> findContentByContentStatusAndActive(ContentStatus contentStatus) {
		return contentRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional
	public List<Content> findAllContent() {
		return contentRepository.findAll();
	}

	@Transactional
	public List<Content> findAllActiveContentSorted() {
		return contentRepository.findAllActiveContentSorted();
	}

	@Transactional
	public List<Content> findAllActiveContentSortedInv() {
		return contentRepository.findAllActiveContentSortedInv();
	}

	@Transactional
	public List<Content> findTop4ActiveSorted() {
		return contentRepository.findTop4ActiveSorted();
	}

}
