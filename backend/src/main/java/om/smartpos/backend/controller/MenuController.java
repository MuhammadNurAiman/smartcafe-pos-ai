package om.smartpos.backend.controller;

import om.smartpos.backend.model.MenuItem;
import om.smartpos.backend.repository.MenuItemRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    public MenuController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public List<MenuItem> getMenu() {
        if (menuItemRepository.count() == 0) {
            menuItemRepository.save(new MenuItem("Nasi Lemak", "Main", new BigDecimal("6.50"), true));
            menuItemRepository.save(new MenuItem("Chicken Rice", "Main", new BigDecimal("8.90"), true));
            menuItemRepository.save(new MenuItem("Iced Latte", "Drink", new BigDecimal("7.50"), true));
            menuItemRepository.save(new MenuItem("Teh Ais", "Drink", new BigDecimal("3.00"), true));
            menuItemRepository.save(new MenuItem("Curry Puff", "Snack", new BigDecimal("2.50"), true));
        }

        return menuItemRepository.findAll();
    }
}