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

        createProduct("Tomato", "Fresh organic tomatoes", 30.0, "kg", 50, veg, murugan, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500");
        createProduct("Brinjal", "Purple brinjals", 40.0, "kg", 30, veg, selvam, "https://images.unsplash.com/photo-1627993043834-010ed2898c0a?w=500");
        createProduct("Ladies Finger (Okra)", "Tender okra", 45.0, "kg", 20, veg, murugan, "https://images.unsplash.com/photo-1597022137021-a3f2d2b512c1?w=500");
        createProduct("Butter Gourd (Bottle Gourd)", "Healthy bottle gourd", 25.0, "kg", 40, veg, lakshmi, "https://images.unsplash.com/photo-1622206413233-a61908ef4010?w=500");
        createProduct("Drumstick", "Long drumsticks", 50.0, "kg", 25, veg, selvam, "https://images.unsplash.com/photo-1595856417539-78a70511d7fc?w=500");
        createProduct("Beans", "Crispy green beans", 60.0, "kg", 20, veg, lakshmi, "https://images.unsplash.com/photo-1568472494191-443306db36d3?w=500");

        createProduct("Mango (Banganapalli)", "Sweet mangoes", 80.0, "kg", 100, fru, murugan, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500");
        createProduct("Banana (Poovan)", "Poovan bananas", 40.0, "dozen", 40, fru, selvam, "https://images.unsplash.com/photo-1571501478200-72044812fa48?w=500");
        createProduct("Papaya", "Ripe papaya", 30.0, "piece", 30, fru, lakshmi, "https://images.unsplash.com/photo-1517282009859-f000ec3b26af?w=500");
        createProduct("Guava", "Fresh green guava", 50.0, "kg", 25, fru, murugan, "https://images.unsplash.com/photo-1536511132890-50d40bf2b6b6?w=500");

        createProduct("Spinach (Keerai)", "Fresh palak/spinach", 15.0, "bunch", 50, leafy, lakshmi, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500");
        createProduct("Coriander", "Fresh coriander leaves", 10.0, "bunch", 100, leafy, selvam, "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?w=500");

        createProduct("Potato", "Medium sized potatoes", 35.0, "kg", 80, root, murugan, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500");
        createProduct("Onion", "Red onions", 30.0, "kg", 100, root, lakshmi, "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500");
        createProduct("Carrot", "Ooty carrots", 60.0, "kg", 40, root, lakshmi, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500");
    }
    
    private void createProduct(String n, String d, double p, String u, int s, Category c, User f, String imgUrl) {
        Product pr = new Product(); pr.setName(n); pr.setDescription(d); pr.setPrice(p);
        pr.setUnit(u); pr.setStock(s); pr.setCategory(c); pr.setFarmer(f); pr.setImageUrl("");
        byte[] bytes = downloadImage(imgUrl);
        if (bytes != null) {
            pr.setImageBytes(bytes);
            pr.setImageType("image/jpeg");
        }
        productRepository.save(pr);
    }

    private byte[] downloadImage(String urlString) {
        try {
            java.net.URL url = new java.net.URL(urlString);
            try (java.io.InputStream is = url.openStream();
                 java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
                byte[] b = new byte[2048];
                int length;
                while ((length = is.read(b)) != -1) {
                    baos.write(b, 0, length);
                }
                return baos.toByteArray();
            }
        } catch (Exception e) {
            System.err.println("Could not download image: " + urlString);
            return null;
        }
    }
}
