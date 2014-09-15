package org.springframework.samples.petclinic.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.User;
import org.springframework.samples.petclinic.model.Users;
import org.springframework.samples.petclinic.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.support.SessionStatus;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping("/users")
    public String getUsers(Model model) {
        Users users = new Users();
        users.getUserList().addAll(this.userService.findAllUsers());
        model.addAttribute("users", users);
        return "users/userList";
    }

    @RequestMapping("/users/remove/{userId}")
    public String deleteUser(Model model, @PathVariable int userId) {
        this.userService.deleteUser(userId);
        return "redirect:/users";
    }

    @RequestMapping(value = "/users/update/{userId}", method = RequestMethod.GET)
    public String getUser(Model model, @PathVariable int userId) {
        User user = this.userService.findUserById(userId);
        model.addAttribute("user", user);
        return "/users/updateUser";
    }

    @RequestMapping(value = "/users/update/{userId}", method = RequestMethod.POST)
    public String updateUser(Model model, @PathVariable int userId, HttpServletRequest request, SessionStatus status,
                             @ModelAttribute("user") User user) {
        this.userService.updateUser(user.getFirstName(), user.getLastName(), userId);
        status.setComplete();
        return "redirect:/users";
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public String processCreationForm(@Valid User user, BindingResult result, SessionStatus status) {
        this.userService.insertUser();

        return "redirect:/users";
    }
}