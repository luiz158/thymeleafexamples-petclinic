package org.springframework.samples.petclinic.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class User extends Person {

    @ManyToOne
    @JoinColumn(name = "type_id")
    private UserType type;

    public UserType getType() {
        return type;
    }

    public void setType(UserType type) {
        this.type = type;
    }


}