package WebPage.ElenaFranconi.Course;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import WebPage.ElenaFranconi.Content.ContentStatus;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
	List<Course> findByArchived(boolean archived);

	List<Course> findByContentStatusAndArchived(ContentStatus contentStatus, boolean archived);

	@Query("SELECT c FROM Course c WHERE c.archived = false ORDER BY " + "CASE WHEN c.contentStatus = 'ONGOING' THEN 1 "
			+ "WHEN c.contentStatus = 'UPCOMING' THEN 2 " + "WHEN c.contentStatus = 'COMPLETED' THEN 3 END, "
			+ "c.relevantDate ASC")
	List<Course> findAllActiveCoursesSorted();

	@Query("SELECT c FROM Course c WHERE c.archived = false ORDER BY "
			+ "CASE WHEN c.contentStatus = 'COMPLETED' THEN 1 " + "WHEN c.contentStatus = 'UPCOMING' THEN 2 "
			+ "WHEN c.contentStatus = 'ONGOING' THEN 3 END, " + "c.relevantDate DESC")
	List<Course> findAllActiveCoursesSortedInv();

}
