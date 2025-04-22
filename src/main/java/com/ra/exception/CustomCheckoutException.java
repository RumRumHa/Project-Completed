package com.ra.exception;

public class CustomCheckoutException extends RuntimeException {
    public CustomCheckoutException(String message) {
        super(message);
    }
}
