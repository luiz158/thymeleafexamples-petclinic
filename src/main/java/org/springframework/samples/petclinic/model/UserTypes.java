package org.springframework.samples.petclinic.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
public class UserTypes {

    private List<UserType> userTypes;

    @XmlElement
    public List<UserType> getUserTypes() {
        if (userTypes == null) {
            userTypes = new ArrayList<UserType>();
        }
        return userTypes;
    }
}