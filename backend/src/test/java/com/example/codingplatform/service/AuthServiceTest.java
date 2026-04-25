package com.example.codingplatform.service;

import com.example.codingplatform.dto.LoginRequest;
import com.example.codingplatform.dto.LoginResponse;
import com.example.codingplatform.dto.RegisterRequest;
import com.example.codingplatform.entity.User;
import com.example.codingplatform.entity.UserProgress;
import com.example.codingplatform.repository.UserProgressRepository;
import com.example.codingplatform.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerRejectsWeakPassword() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("hanif");
        request.setEmail("hanif@example.com");
        request.setPassword("weakpw");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(request));

        assertEquals(
                "Password must be at least 8 characters long and contain at least one special character",
                ex.getMessage()
        );
    }

    @Test
    void registerTrimsInputAndSavesUser() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("  hanif  ");
        request.setEmail("  hanif@example.com  ");
        request.setPassword("Valid@123");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User saved = authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        assertEquals("hanif", captor.getValue().getUsername());
        assertEquals("hanif@example.com", captor.getValue().getEmail());
        assertEquals("Valid@123", saved.getPassword());
    }

    @Test
    void loginAllowsEmailIdentifierAndReturnsStoredXp() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("hanif@example.com");
        request.setPassword("Valid@123");

        User user = new User("hanif", "hanif@example.com", "Valid@123");
        ReflectionTestUtils.setField(user, "id", 7L);

        UserProgress progress = new UserProgress();
        progress.setUserId(7L);
        progress.setXp(40);

        when(userRepository.findByUsername("hanif@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("hanif@example.com")).thenReturn(Optional.of(user));
        when(userProgressRepository.findByUserId(7L)).thenReturn(Optional.of(progress));

        LoginResponse response = authService.login(request);

        assertEquals("dummy-session-token", response.getToken());
        assertEquals("hanif", response.getUser().getUsername());
        assertEquals("hanif@example.com", response.getUser().getEmail());
        assertEquals(40, response.getUser().getXp());
    }

    @Test
    void loginRejectsWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("hanif");
        request.setPassword("Wrong@123");

        User user = new User("hanif", "hanif@example.com", "Valid@123");

        when(userRepository.findByUsername("hanif")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.login(request));

        assertTrue(ex.getMessage().contains("Invalid username/email or password"));
    }
}
