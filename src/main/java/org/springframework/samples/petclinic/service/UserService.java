package org.springframework.samples.petclinic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.ParameterizedBeanPropertyRowMapper;
import org.springframework.orm.ObjectRetrievalFailureException;
import org.springframework.samples.petclinic.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class UserService {

    private JdbcTemplate jdbcTemplate;
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    public UserService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Collection<User> findAllUsers() throws DataAccessException {
        List<User> users = new ArrayList<User>();
        users.addAll(this.jdbcTemplate.query(
                "SELECT id, first_name, last_name FROM users ORDER BY last_name,first_name",
                ParameterizedBeanPropertyRowMapper.newInstance(User.class)));

        return users;
    }

    public void deleteUser(int userId) {
        this.jdbcTemplate.update("DELETE FROM users WHERE id = ?", userId);
    }

    public void insertUser() {
        this.jdbcTemplate.execute("INSERT INTO users VALUES (NULL,'Liisi', 'K')");
    }

    public User findUserById(int userId) {
        User user;
        try {
            String sql = "SELECT id, first_name, last_name FROM users WHERE id= ?";
            user = (User) jdbcTemplate.queryForObject(sql, new Object[]{userId}, new BeanPropertyRowMapper(User.class));
        } catch (EmptyResultDataAccessException ex) {
            System.out.println("findUserById error occured: " + ex);
            throw new ObjectRetrievalFailureException(User.class, userId);
        }
        return user;
    }

    public void updateUser(String firstName, String lastName, int userId) {
        this.jdbcTemplate.update("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
                firstName, lastName, userId);
    }
}