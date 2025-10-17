package WebPage.ElenaFranconi.Event;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import WebPage.ElenaFranconi.Content.ContentStatus;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

	List<Event> findByArchived(boolean archived);

	List<Event> findByContentStatusAndArchived(ContentStatus contentStatus, boolean archived);

	@Query("SELECT e FROM Event e WHERE e.archived = false ORDER BY " + "CASE WHEN e.contentStatus = 'ONGOING' THEN 1 "
			+ "WHEN e.contentStatus = 'UPCOMING' THEN 2 " + "WHEN e.contentStatus = 'COMPLETED' THEN 3 END, "
			+ "e.relevantDate ASC")
	List<Event> findAllActiveEventsSorted();

	@Query("SELECT e FROM Event e WHERE e.archived = false ORDER BY "
			+ "CASE WHEN e.contentStatus = 'COMPLETED' THEN 1 " + "WHEN e.contentStatus = 'UPCOMING' THEN 2 "
			+ "WHEN e.contentStatus = 'ONGOING' THEN 3 END, " + "e.relevantDate DESC")
	List<Event> findAllActiveEventsSortedInv();

}
