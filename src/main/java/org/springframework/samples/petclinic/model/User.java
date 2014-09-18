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

    public User() {
        super();
    }

    public User(int id, String fn, String ln,UserType type) {
        this.setId(id);
        this.setFirstName(fn);
        this.setLastName(ln);
        this.type = type;
    }

    public UserType getType() {
        return type;
    }

    public void setType(UserType type) {
        this.type = type;
    }


    @Override
    public String toString() {
        return "User{" +
                "name=" + this.getFirstName() +
                " name=" + this.getLastName() +
                " type=" + type.getName() +
                '}';
    }
}