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

        Category veg = categoryRepository.save(new Category("Vegetables"));
        Category fru = categoryRepository.save(new Category("Fruits"));
        Category leafy = categoryRepository.save(new Category("Leafy Greens"));
        Category root = categoryRepository.save(new Category("Roots & Tubers"));
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
