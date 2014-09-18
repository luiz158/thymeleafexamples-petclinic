package org.springframework.samples.petclinic.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.ParameterizedBeanPropertyRowMapper;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.orm.ObjectRetrievalFailureException;
import org.springframework.samples.petclinic.model.User;
import org.springframework.samples.petclinic.model.UserType;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.util.*;

@Service
public class UserService {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public UserService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Collection<User> findAllUsers() throws DataAccessException {
//        List<User> users = new ArrayList<User>();
//        users.addAll(this.jdbcTemplate.query(
//                "SELECT id, first_name, last_name, type_id FROM users ORDER BY last_name,first_name",
//                ParameterizedBeanPropertyRowMapper.newInstance(User.class)));

        List<User> users = new ArrayList<User>();

        SqlRowSet rs = this.jdbcTemplate.queryForRowSet("SELECT id, first_name, last_name, type_id FROM users");
        while(rs.next()){
            int id = rs.getInt(rs.findColumn("id"));
            String fn = rs.getString(rs.findColumn("first_name"));
            String ln = rs.getString(rs.findColumn("last_name"));
            UserType ut = this.findUserTypeById(rs.getInt(rs.findColumn("type_id")));
            User u = new User(id,fn,ln,ut);
            users.add(u);
            System.out.println(u);
        }


        return users;
    }

    public Collection<UserType> findAllUserTypes() throws DataAccessException {
        List<UserType> userTypes = new ArrayList<UserType>();
        userTypes.addAll(this.jdbcTemplate.query(
                "SELECT id, name FROM types",
                ParameterizedBeanPropertyRowMapper.newInstance(UserType.class)));

        return userTypes;
    }

    public void deleteUser(int userId) {
        this.jdbcTemplate.update("DELETE FROM users WHERE id = ?", userId);
    }

    public void insertUser(User user) {
        Object[] params = new Object[]{user.getFirstName(), user.getLastName()};
        int[] types = new int[]{Types.VARCHAR, Types.VARCHAR};

        this.jdbcTemplate.update("INSERT INTO users VALUES (NULL, ?, ?,1)", params, types);
    }

    public User findUserById(int userId) {
        User user;
        try {
            String sql = "SELECT id, first_name, last_name, type_id FROM users WHERE id= ?";
            user = jdbcTemplate.queryForObject(sql, new Object[]{userId}, new BeanPropertyRowMapper<User>(User.class));
        } catch (EmptyResultDataAccessException ex) {
            System.out.println("findUserById error occured: " + ex);
            throw new ObjectRetrievalFailureException(User.class, userId);
        }
        return user;
    }

    public UserType findUserTypeById(int userTypeId) {
        UserType userType;
        try {
            String sql = "SELECT id, name FROM types WHERE id= ?";
            userType = jdbcTemplate.queryForObject(sql, new Object[]{userTypeId}, new BeanPropertyRowMapper<UserType>(UserType.class));
        } catch (EmptyResultDataAccessException ex) {
            System.out.println("findUserById error occured: " + ex);
            throw new ObjectRetrievalFailureException(UserType.class, userTypeId);
        }
        return userType;
    }




    public void updateUser(String firstName, String lastName, int userId) {
        this.jdbcTemplate.update("UPDATE users SET first_name = ?, last_name = ?, type_id = 1 WHERE id = ?",
                firstName, lastName, userId);
    }

  public Set<UserType> getTypes() {
      Set<UserType> types = new HashSet<UserType>();

      types.addAll(this.jdbcTemplate.query(
            "SELECT id, name FROM types",
            ParameterizedBeanPropertyRowMapper.newInstance(UserType.class)));

      return types;
  }
}