package WebPage.ElenaFranconi.Content;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContentQueryService {
	@Autowired
	private ContentRepository contentRepository;

	// GET METHODS
	@Transactional(readOnly = true)
	public List<Content> findAllActiveContent() {
		return contentRepository.findByArchived(false);
	}

	@Transactional(readOnly = true)
	public List<Content> findContentByContentStatusAndActive(ContentStatus contentStatus) {
		return contentRepository.findByContentStatusAndArchived(contentStatus, false);
	}

	@Transactional(readOnly = true)
	public List<Content> findAllContent() {
		return contentRepository.findAll();
	}

	@Transactional(readOnly = true)
	public List<Content> findAllActiveContentSorted() {
		return contentRepository.findAllActiveContentSorted();
	}

	@Transactional(readOnly = true)
	public List<Content> findAllActiveContentSortedInv() {
		return contentRepository.findAllActiveContentSortedInv();
	}

	@Transactional(readOnly = true)
	public List<Content> findTop6ActiveContentSorted() {
		Page<Content> page = contentRepository.findActiveContentSortedPaged(PageRequest.of(0, 6));
		return page.getContent();
	}

	@Transactional(readOnly = true)
	public Page<Content> findActiveContentSortedPaged(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return contentRepository.findActiveContentSortedPaged(pageable);
	}

}
