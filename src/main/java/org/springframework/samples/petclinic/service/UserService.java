/*
 * Copyright 2002-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

    public void insertUser(String firstName,String lastName) {
        this.jdbcTemplate.update("INSERT INTO users VALUES(NULL, ? , ?)", firstName, lastName);
    }

    public User findUserById(int userId) {
        User user;
        try {
            String sql = "SELECT id, first_name, last_name FROM users WHERE id= ?";
            user = (User) jdbcTemplate.queryForObject(sql, new Object[]{userId}, new BeanPropertyRowMapper(User.class));
        } catch (EmptyResultDataAccessException ex) {
            throw new ObjectRetrievalFailureException(User.class, userId);
        }
        return user;
    }

    public void updateUser(String firstName, String lastName, int userId) {
        this.jdbcTemplate.update("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?", firstName, lastName, userId);
    }
}