package WebPage.ElenaFranconi.Recipients;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Recipient {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private String email;

	private boolean privacyAccepted;

	private boolean subscribed;

	private String subscribeToken;

	private String unsubscribeToken;

	private LocalDateTime subscriptionDate;

}
