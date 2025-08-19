package com.remotehub.remote_work_hub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@ControllerAdvice
@RestController
public class GlobalExceptionHandler {

    /**
     * Handles exceptions related to invalid credentials, returning a 401 status.
     * @param ex The InvalidCredentialsException that was thrown.
     * @return A ResponseEntity with a 401 status and a custom error message.
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        // Return a JSON object with a specific error message.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }

    /**
     * Handles generic RuntimeExceptions, returning a 400 status.
     * @param ex The RuntimeException that was thrown.
     * @return A ResponseEntity with a 400 status and a custom error message.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // Return a JSON object with a specific error message.
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }
}
