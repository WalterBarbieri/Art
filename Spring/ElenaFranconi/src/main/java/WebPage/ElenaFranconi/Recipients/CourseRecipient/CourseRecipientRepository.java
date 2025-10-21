package WebPage.ElenaFranconi.Recipients.CourseRecipient;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRecipientRepository extends JpaRepository<CourseRecipient, UUID> {

}
