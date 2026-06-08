package om.smartpos.backend.controller;

import om.smartpos.backend.dto.CreateOrderRequest;
import om.smartpos.backend.dto.OrderItemRequest;
import om.smartpos.backend.dto.PaymentRequest;
import om.smartpos.backend.model.MenuItem;
import om.smartpos.backend.model.Order;
import om.smartpos.backend.model.OrderItem;
import om.smartpos.backend.repository.MenuItemRepository;
import om.smartpos.backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderController(OrderRepository orderRepository, MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    @PostMapping
    public Order createOrder(@RequestBody CreateOrderRequest request) {
        Order order = new Order();
        order.setTableNumber(request.getTableNumber());
        order.setOrderType(request.getOrderType());
        if ("TAKEAWAY".equalsIgnoreCase(request.getOrderType())) {
            order.setStatus("UNPAID");
        } else {
            order.setStatus("NEW");
        }

        List<OrderItem> orderItems = request.getItems().stream().map(itemRequest -> {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            return new OrderItem(
                    menuItem.getId(),
                    menuItem.getName(),
                    itemRequest.getQuantity(),
                    itemRequest.getNote(),
                    menuItem.getPrice());
        }).toList();

        order.setItems(orderItems);
        order.calculateTotal();

        order.setAiKitchenSummary(generateKitchenSummary(orderItems));
        order.setAiUpsellSuggestion(generateUpsellSuggestion(orderItems));

        return orderRepository.save(order);
    }

    @PatchMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.updateStatus(status);
        return orderRepository.save(order);
    }

    @PostMapping("/{id}/payment")
    public Order payOrder(@PathVariable Long id, @RequestBody PaymentRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.markPaid(request.getPaymentMethod());

        if ("TAKEAWAY".equalsIgnoreCase(order.getOrderType())) {
            order.updateStatus("PAID");
        } else {
            order.updateStatus("PAID");
        }

        return orderRepository.save(order);
    }

    private String generateKitchenSummary(List<OrderItem> items) {
        return items.stream()
                .map(item -> item.getQuantity() + "x " + item.getItemName()
                        + (item.getNote() != null && !item.getNote().isBlank()
                                ? " (" + item.getNote() + ")"
                                : ""))
                .reduce("Prepare: ", (summary, itemText) -> summary.equals("Prepare: ")
                        ? summary + itemText
                        : summary + ", " + itemText);
    }

    private String generateUpsellSuggestion(List<OrderItem> items) {
        boolean hasDrink = items.stream().anyMatch(item -> item.getItemName().toLowerCase().contains("latte")
                || item.getItemName().toLowerCase().contains("teh"));

        boolean hasSnack = items.stream().anyMatch(item -> item.getItemName().toLowerCase().contains("puff"));

        if (hasDrink && !hasSnack) {
            return "Suggest adding Curry Puff as a snack pairing with the drink.";
        }

        return "Suggest adding a drink or snack to increase the order value.";
    }
}