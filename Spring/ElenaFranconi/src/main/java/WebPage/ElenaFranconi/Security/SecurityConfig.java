package WebPage.ElenaFranconi.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import WebPage.ElenaFranconi.Exceptions.CustomAccessDeniedHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Autowired
	JWTAuthFilter jwtFilter;

	@Autowired
	CorsFilter corsFilter;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	UserDetailService userDetailService;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(c -> c.disable());
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/user/**").authenticated());
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**").permitAll());
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/content/**").permitAll());
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/api/course/**").hasAuthority("ADMIN"));
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/api/event/**").hasAuthority("ADMIN"));
		http.authorizeHttpRequests(auth -> auth.anyRequest().denyAll());

		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		http.addFilterBefore(corsFilter, JWTAuthFilter.class);
		http.exceptionHandling(handling -> handling.accessDeniedHandler(new CustomAccessDeniedHandler()));
		return http.build();
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailService).passwordEncoder(passwordEncoder);
	}

}
