package in.tm;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    static void main() {

        PaymentService service = new PaymentService();

        OrderService order = new OrderService(service);

        order.placeOrder();
    }
}
