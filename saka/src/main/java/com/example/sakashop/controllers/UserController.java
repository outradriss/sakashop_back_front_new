package com.example.sakashop.controllers;

import com.example.sakashop.Configurations.TokenProvider;
import com.example.sakashop.DTO.UserDTO;
import com.example.sakashop.Entities.AuthToken;
import com.example.sakashop.Entities.LoginUser;
import com.example.sakashop.Entities.User;
import com.example.sakashop.Exceptions.ErrorResponse;
import com.example.sakashop.services.implServices.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Autowired
    private UserServiceImpl userService;

    /**
     * Generates a token for the given user credentials.
     *
     * @param loginUser The user's login credentials.
     * @return A response entity containing the generated token.
     * @throws AuthenticationException if authentication fails.
     */
    @PostMapping(value = "/authenticate")
    public ResponseEntity<?> generateToken(@RequestBody LoginUser loginUser) throws AuthenticationException {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUser.getEmail(),
                        loginUser.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtTokenUtil.generateToken(authentication);
        return ResponseEntity.ok(new AuthToken(token));
    }

    /**
     * Saves a new user.
     *
     * @param user The user to be saved.
     * @return The saved user.
     */
    @PostMapping(value="/register")
    public ResponseEntity <User> saveUser(@RequestBody UserDTO user){
      try {
        User savedUser = userService.save(user);
        return ResponseEntity.ok(savedUser);
      } catch (IllegalArgumentException ex) {
        return ResponseEntity.badRequest().build();
      }
    }

    /**
     * Returns a message that can only be accessed by users with the 'ADMIN' role.
     *
     * @return A message that can only be accessed by admins.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/adminping", method = RequestMethod.GET)
    public ResponseEntity<String> adminPing() {
      return ResponseEntity.ok("Only Admins Can Read This");
    }


  /**
     * Returns a message that can be accessed by any user.
     *
     * @return A message that can be accessed by any user.
     */
    @PreAuthorize("hasRole('USER')")
    @RequestMapping(value="/userping", method = RequestMethod.GET)
    public ResponseEntity <String> userPing(){
      return ResponseEntity.ok("Any Users Can Read This");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value="/create/employee", method = RequestMethod.POST)
    public ResponseEntity <User> createEmployee(@RequestBody UserDTO user){
        return userService.createEmployee(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value="/find/all", method = RequestMethod.GET)
    public ResponseEntity<List<User>> getAllList(){
        return userService.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/find/by/username")
    public ResponseEntity <User> getAllList(@RequestParam String username){
        User user= userService.findOne(username);
      if (user != null) {
        return ResponseEntity.ok(user);  // Retourne un code HTTP 200 avec l'utilisateur
      } else {
        return ResponseEntity.notFound().build();  // Si l'utilisateur n'est pas trouvé, retourne HTTP 404
      }
    }

}
