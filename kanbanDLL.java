class Action {
    String task;
    String from;
    String to;

    Action(String task, String from, String to) {
        this.task = task;
        this.from = from;
        this.to = to;
    }

    void apply() {
        System.out.println("APPLY: " + task + " " + from + " → " + to);
    }

    void undo() {
        System.out.println("UNDO: " + task + " " + to + " → " + from);
    }
}

class Node {
    Action action;
    Node prev, next;

    Node(Action action) {
        this.action = action;
    }
}

class History {
    Node head = null;
    Node current = null;

    void addAction(Action action) {
        Node node = new Node(action);

        // Clear future history
        if (current != null && current.next != null) {
            current.next = null;
        }

        if (head == null) {
            head = node;
        } else {
            node.prev = current;
            if (current != null)
                current.next = node;
        }

        current = node;
        action.apply();
    }

    void undo() {
        if (current == null) return;
        current.action.undo();
        current = current.prev;
    }

    void redo() {
        if (current != null && current.next != null) {
            current = current.next;
            current.action.apply();
        }
    }
}

public class kanbanDLL{
    public static void main(String[] args) {
        History history = new History();

        history.addAction(new Action("Task1", "TODO", "IN_PROGRESS"));
        history.addAction(new Action("Task1", "IN_PROGRESS", "DONE"));

        history.undo();
        history.redo();
    }
}
