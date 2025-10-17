package WebPage.ElenaFranconi.User.dto;

import WebPage.ElenaFranconi.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserRequestDto {

	@NotNull(message = "The Username field is required")
	@NotEmpty(message = "The Username field cannot be empty")
	private String username;

	@NotNull(message = "The Name field is required")
	@NotEmpty(message = "The Name field cannot be empty")
	private String name;

	@NotNull(message = "The Surname field is required")
	@NotEmpty(message = "The Surname field cannot be empty")
	private String surname;

	@NotNull(message = "The Email field is required")
	@NotEmpty(message = "The Email field cannot be empty")
	@Email(message = "The Email field must contain a valid email address")
	private String email;

	@NotNull(message = "The Password field is required")
	@NotEmpty(message = "The Password field cannot be empty")
	private String password;

	@NotNull(message = "The Role field is required")
	private Role role;

}
