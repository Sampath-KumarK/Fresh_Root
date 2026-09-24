package com.freshroots.seed;
import com.freshroots.model.*;
import com.freshroots.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired UserRepository userRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired ProductRepository productRepository;
    @Autowired PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        User admin = new User(); admin.setName("Admin"); admin.setEmail("admin@freshroots.com");
        admin.setPassword(encoder.encode("Admin@123")); admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User murugan = new User(); murugan.setName("Murugan"); murugan.setEmail("murugan@freshroots.com");
        murugan.setPassword(encoder.encode("Farmer@123")); murugan.setRole(Role.FARMER); murugan.setLocation("Pollachi");
        userRepository.save(murugan);

        User lakshmi = new User(); lakshmi.setName("Lakshmi"); lakshmi.setEmail("lakshmi@freshroots.com");
        lakshmi.setPassword(encoder.encode("Farmer@123")); lakshmi.setRole(Role.FARMER); lakshmi.setLocation("Ooty");
        userRepository.save(lakshmi);

        User selvam = new User(); selvam.setName("Selvam"); selvam.setEmail("selvam@freshroots.com");
        selvam.setPassword(encoder.encode("Farmer@123")); selvam.setRole(Role.FARMER); selvam.setLocation("Theni");
        userRepository.save(selvam);

        User priya = new User(); priya.setName("Priya"); priya.setEmail("customer@freshroots.com");
        priya.setPassword(encoder.encode("Customer@123")); priya.setRole(Role.CUSTOMER); priya.setLocation("Coimbatore");
        userRepository.save(priya);

        Category veg = categoryRepository.save(new Category("Vegetables"));
        Category fru = categoryRepository.save(new Category("Fruits"));
        Category leafy = categoryRepository.save(new Category("Leafy Greens"));
        Category root = categoryRepository.save(new Category("Roots & Tubers"));

        createProduct("Tomato", "Fresh organic tomatoes", 30.0, "kg", 50, veg, murugan);
        createProduct("Brinjal", "Purple brinjals", 40.0, "kg", 30, veg, selvam);
        createProduct("Ladies Finger (Okra)", "Tender okra", 45.0, "kg", 20, veg, murugan);
        createProduct("Butter Gourd (Bottle Gourd)", "Healthy bottle gourd", 25.0, "kg", 40, veg, lakshmi);
        createProduct("Drumstick", "Long drumsticks", 50.0, "kg", 25, veg, selvam);
        createProduct("Beans", "Crispy green beans", 60.0, "kg", 20, veg, lakshmi);

        createProduct("Mango (Banganapalli)", "Sweet mangoes", 80.0, "kg", 100, fru, murugan);
        createProduct("Banana (Poovan)", "Poovan bananas", 40.0, "dozen", 40, fru, selvam);
        createProduct("Papaya", "Ripe papaya", 30.0, "piece", 30, fru, lakshmi);
        createProduct("Guava", "Fresh green guava", 50.0, "kg", 25, fru, murugan);

        createProduct("Spinach (Keerai)", "Fresh palak/spinach", 15.0, "bunch", 50, leafy, lakshmi);
        createProduct("Coriander", "Fresh coriander leaves", 10.0, "bunch", 100, leafy, selvam);

        createProduct("Potato", "Medium sized potatoes", 35.0, "kg", 80, root, murugan);
        createProduct("Onion", "Red onions", 30.0, "kg", 100, root, lakshmi);
        createProduct("Carrot", "Ooty carrots", 60.0, "kg", 40, root, lakshmi);
    }
    
    private void createProduct(String n, String d, double p, String u, int s, Category c, User f) {
        Product pr = new Product(); pr.setName(n); pr.setDescription(d); pr.setPrice(p);
        pr.setUnit(u); pr.setStock(s); pr.setCategory(c); pr.setFarmer(f); pr.setImageUrl("");
        productRepository.save(pr);
    }
}
