#include <iostream>
using namespace std;

struct Action {
    string task, from, to;

    void apply() {
        cout << "APPLY: " << task << " " << from << " → " << to << endl;
    }

    void undo() {
        cout << "UNDO: " << task << " " << to << " → " << from << endl;
    }
};

struct Node {
    Action action;
    Node* prev;
    Node* next;

    Node(Action a) : action(a), prev(nullptr), next(nullptr) {}
};

class History {
    Node* head = nullptr;
    Node* current = nullptr;

public:
    void add(Action a) {
        Node* node = new Node(a);

        if (current && current->next) {
            current->next = nullptr;
        }

        if (!head) {
            head = node;
        } else {
            node->prev = current;
            if (current)
                current->next = node;
        }

        current = node;
        a.apply();
    }

    void undo() {
        if (!current) return;
        current->action.undo();
        current = current->prev;
    }

    void redo() {
        if (current && current->next) {
            current = current->next;
            current->action.apply();
        }
    }
};

int main() {
    History history;

    history.add({"Task1", "TODO", "IN_PROGRESS"});
    history.add({"Task1", "IN_PROGRESS", "DONE"});

    history.undo();
    history.redo();

    return 0;
}
