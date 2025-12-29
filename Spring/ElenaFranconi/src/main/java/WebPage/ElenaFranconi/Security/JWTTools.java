package WebPage.ElenaFranconi.Security;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import WebPage.ElenaFranconi.Exceptions.BadRequestException;
import WebPage.ElenaFranconi.Exceptions.UnauthorizedException;
import WebPage.ElenaFranconi.User.User;
import WebPage.ElenaFranconi.User.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTTools {

	@Value("${spring.jwt.secret}")
	private String secret;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserService us;

	// Authentication token

	public String createToken(User user) {
		String token = Jwts.builder().setSubject(user.getId().toString())
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
				.signWith(Keys.hmacShaKeyFor(secret.getBytes())).compact();

		return token;
	}

	public void verifyToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build().parse(token);
		} catch (Exception e) {
			throw new UnauthorizedException("Invalid token, please log in again");
		}
	}

	// Reset password token

	public String createResetToken(User user) {
		Date exipirationDate = new Date(System.currentTimeMillis() + 1000 * 60 * 60);
		String token = Jwts.builder().setSubject(user.getId().toString())
				.setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(exipirationDate)
				.signWith(Keys.hmacShaKeyFor(secret.getBytes())).compact();

		String hashedToken = passwordEncoder.encode(token);
		user.setResetToken(hashedToken);
		user.setResetTokenExpirationDate(exipirationDate);
		us.updateUser(user);
		return token;
	}

	public void verifyResetToken(String token) {
		try {
			String userId = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build()
					.parseClaimsJws(token).getBody().getSubject();

			User user = us.findById(UUID.fromString(userId));

			if (!passwordEncoder.matches(token, user.getResetToken())
					|| user.getResetTokenExpirationDate().before(new Date())) {
				throw new UnauthorizedException("Invalid token, please request a new one");
			}
		} catch (Exception e) {
			throw new UnauthorizedException("Invalid token, please request a new one");
		}
	}

	// Extract info from token

	public String extractSubject(String token) {
		return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build().parseClaimsJws(token)
				.getBody().getSubject();
	}

	public String extractEmail(String token) {
		try {
			Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build()
					.parseClaimsJws(token);
			return claims.getBody().getSubject();
		} catch (JwtException e) {
			throw new BadRequestException("Invalid token, please log in again");
		}
	}

}
