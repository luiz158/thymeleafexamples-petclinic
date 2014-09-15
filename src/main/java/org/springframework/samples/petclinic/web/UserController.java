package org.springframework.samples.petclinic.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.User;
import org.springframework.samples.petclinic.model.Users;
import org.springframework.samples.petclinic.service.UserService;
import org.springframework.samples.petclinic.util.UserValidator;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.support.SessionStatus;

import javax.servlet.http.HttpServletRequest;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping("/users")
    public String getUsers(Model model) {
        Users users = new Users();
        // puhtalt selleks, et saaks initsialiseerida Thymeleaf'i view's nt vormil *{firstName} objekti, kuna sul on
        // ühel ja samal vormil nii lisamine kui kuvamine
        User user = new User();
        users.getUserList().addAll(this.userService.findAllUsers());
        model.addAttribute("users", users);
        model.addAttribute("user", user);
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
                             @ModelAttribute("user") User user,BindingResult result) {
        new UserValidator().validate(user, result);
        if(result.hasErrors()){
            return "redirect:/users/update/{userId}";
        }else{
            this.userService.updateUser(user.getFirstName(), user.getLastName(), userId);
            return "redirect:/users";
        }
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public String insertUser(Model model, @ModelAttribute("user") User user, SessionStatus status, BindingResult result) {
        new UserValidator().validate(user, result);
        if (result.hasErrors()) {
            Users users = new Users();
            users.getUserList().addAll(this.userService.findAllUsers());
            model.addAttribute("users", users);
            return "users/userList";
        } else {
            this.userService.insertUser(user);
            return "redirect:/users";
        }
    }
}