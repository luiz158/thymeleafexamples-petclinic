package org.springframework.samples.petclinic.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
public class Users {

    private List<User> users;

    @XmlElement
    public List<User> getUserList() {
        if (users == null) {
            users = new ArrayList<User>();
        }
        return users;
    }
}