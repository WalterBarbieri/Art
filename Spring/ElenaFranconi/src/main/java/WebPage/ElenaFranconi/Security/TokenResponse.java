package WebPage.ElenaFranconi.Security;

import WebPage.ElenaFranconi.User.User;
import WebPage.ElenaFranconi.User.dto.UserTokenDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponse {

	private String token;

	private UserTokenDto userTokenResponse = new UserTokenDto();

	public TokenResponse(String token, User user) {
		super();
		this.token = token;
		this.userTokenResponse.setId(user.getId());
		this.userTokenResponse.setUsername(user.getUsername());
		this.userTokenResponse.setRole(user.getRole());
	}
}
