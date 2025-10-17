package WebPage.ElenaFranconi.Content;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentRepository extends JpaRepository<Content, UUID> {
	List<Content> findByContentStatusAndArchived(ContentStatus contentStatus, boolean archived);

	List<Content> findByArchived(boolean archived);

	@Query("SELECT c FROM Content c WHERE c.archived = false ORDER BY "
			+ "CASE WHEN c.contentStatus = 'ONGOING' THEN 1 " + "WHEN c.contentStatus = 'UPCOMING' THEN 2 "
			+ "WHEN c.contentStatus = 'COMPLETED' THEN 3 END, " + "c.relevantDate ASC")
	List<Content> findAllActiveContentSorted();

	@Query("SELECT c FROM Content c WHERE c.archived = false ORDER BY "
			+ "CASE WHEN c.contentStatus = 'COMPLETED' THEN 1 " + "WHEN c.contentStatus = 'UPCOMING' THEN 2 "
			+ "WHEN c.contentStatus = 'ONGOING' THEN 3 END, " + "c.relevantDate DESC")
	List<Content> findAllActiveContentSortedInv();

	@Query("SELECT c FROM Content c WHERE c.archived = false ORDER BY "
			+ "CASE WHEN c.contentStatus = 'ONGOING' THEN 1 " + "WHEN c.contentStatus = 'UPCOMING' THEN 2 "
			+ "WHEN c.contentStatus = 'COMPLETED' THEN 3 END, " + "c.relevantDate ASC LIMIT 4")
	List<Content> findTop4ActiveSorted();

}
