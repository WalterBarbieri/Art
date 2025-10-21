package WebPage.ElenaFranconi.EventDateSlot;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventDateSlotRepository extends JpaRepository<EventDateSlot, UUID> {

}
