package WebPage.ElenaFranconi.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import WebPage.ElenaFranconi.Exceptions.NotFoundException;
import WebPage.ElenaFranconi.User.User;
import WebPage.ElenaFranconi.User.UserService;

@Service
public class UserDetailService implements UserDetailsService {

	@Autowired
	private UserService us;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = us.findByUsername(username);

		if (user == null) {
			throw new NotFoundException(username);
		}

		return user;
	}

}
