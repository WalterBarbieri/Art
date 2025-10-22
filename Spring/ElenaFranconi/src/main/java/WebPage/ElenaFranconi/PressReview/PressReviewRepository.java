package WebPage.ElenaFranconi.PressReview;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PressReviewRepository extends JpaRepository<PressReview, UUID> {
	List<PressReview> findByCourseId(UUID courseId);

	List<PressReview> findByEventId(UUID eventId);

}
