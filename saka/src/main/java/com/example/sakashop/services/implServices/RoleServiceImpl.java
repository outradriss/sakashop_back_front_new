package com.example.sakashop.services.implServices;

import com.example.sakashop.DAO.RoleDAO;
import com.example.sakashop.Entities.Role;
import com.example.sakashop.services.roleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements roleService {

    @Autowired
    private RoleDAO roleDao;

    @Override
    public Role findByName(String name) {
        // Find role by name using the roleDao
        Role role = roleDao.findRoleByName(name);
        return role;
    }
}
