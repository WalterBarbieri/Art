package WebPage.ElenaFranconi.Security;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import WebPage.ElenaFranconi.User.User;
import WebPage.ElenaFranconi.User.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

	@Autowired
	private JWTTools jt;

	@Autowired
	private UserService us;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		response.setHeader("X-Frame-Options", "DENY");
		String authHeader = request.getHeader("Authorization");
		System.out.println("***FILTRO***");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Missing token in the authorization header");
			return;
		}

		String token = authHeader.substring(7);
		System.out.println("Token: " + token);

		jt.verifyToken(token);

		String id = jt.extractSubject(token);
		User currentUser = us.findById(UUID.fromString(id));

		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(currentUser, null,
				currentUser.getAuthorities());

		SecurityContextHolder.getContext().setAuthentication(authToken);
		filterChain.doFilter(request, response);

	}

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		System.out.println(request.getServletPath());
		String[] allowedEndPoints = { "/auth/**", "/content/**" };
		AntPathMatcher patchMatcher = new AntPathMatcher();
		for (String endpoint : allowedEndPoints) {
			if (patchMatcher.match(endpoint, request.getServletPath())) {
				return true;
			}
		}
		return false;
	}

}
