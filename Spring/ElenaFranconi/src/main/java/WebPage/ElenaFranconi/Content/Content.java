package WebPage.ElenaFranconi.Content;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@DiscriminatorColumn(name = "content_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Content {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	private String title;

	@Column(length = 5000)
	private String description;

	private String coverImagePath;

	@ElementCollection
	private List<String> imagePaths = new ArrayList<>();

	@ElementCollection
	private List<String> filePaths = new ArrayList<>();

	@ElementCollection
	private List<String> videoPaths = new ArrayList<>();

	private String location;

	private LocalDateTime createdAt;

	@Enumerated(EnumType.STRING)
	private ContentStatus contentStatus;

	private LocalDateTime relevantDate;

	private boolean archived;

	public abstract ContentStatus calculateContentStatus();

	public abstract LocalDateTime calculateRelevantDate();

}
