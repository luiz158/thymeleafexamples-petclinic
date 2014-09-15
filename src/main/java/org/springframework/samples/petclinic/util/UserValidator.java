package org.springframework.samples.petclinic.util;

import org.springframework.samples.petclinic.model.User;
import org.springframework.util.StringUtils;
import org.springframework.validation.Errors;

public class UserValidator {
    public void validate(User user, Errors errors) {
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        if (!StringUtils.hasLength(firstName)) {
            errors.rejectValue("firstName", "required", "required");
        } else if (!StringUtils.hasLength(lastName)) {
            errors.rejectValue("lastName", "required", "required");
        }
    }
}