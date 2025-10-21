package WebPage.ElenaFranconi.Recipients.EventRecipient;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRecipientRepository extends JpaRepository<EventRecipient, UUID> {

}
