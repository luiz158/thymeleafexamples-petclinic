package org.springframework.samples.petclinic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.model.User;
import org.springframework.samples.petclinic.model.UserType;
import org.springframework.samples.petclinic.model.UserTypes;
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
import java.util.Set;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping("/users")
    public String getUsers(Model model, @ModelAttribute("success") String success) {
        User user = new User();
        // puhtalt selleks, et saaks initsialiseerida Thymeleaf'i view's nt vormil *{firstName} objekti, kuna sul on
        // ühel ja samal vormil nii lisamine kui kuvamine

        UserTypes userTypes = new UserTypes();
        userTypes.getUserTypes().addAll(this.userService.findAllUserTypes());
        model.addAttribute("userTypes",userTypes);

        Users users = new Users();
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
        Set<UserType> types = this.userService.getTypes();
        model.addAttribute("types", types);
        model.addAttribute("user", user);
        return "/users/updateUser";
    }

    @RequestMapping(value = "/users/update/{userId}", method = RequestMethod.POST)
    public String updateUser(Model model, @PathVariable int userId, HttpServletRequest request, SessionStatus status,
                             @ModelAttribute("user") User user,BindingResult result) {
        new UserValidator().validate(user, result);
        if(result.hasErrors()){
            return "/users/updateUser";
        }else{
            this.userService.updateUser(user.getFirstName(), user.getLastName(), user.getType(), userId);
            model.addAttribute("success", "User successfully UPDATED!");
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
            model.addAttribute("success", "User successfully added!");
            return "redirect:/users";
        }
    }
}