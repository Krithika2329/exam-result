// bst.js
class Node {
    constructor(student) {
        this.student = student; // Store student data
        this.left = null;  // Left child node
        this.right = null; // Right child node
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // Insert a student into the BST
    insert(student) {
        const newNode = new Node(student);

        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    // Recursive helper method to insert a node
    insertNode(node, newNode) {
        if (newNode.student.score < node.student.score) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    // In-order traversal of the BST (ascending order of scores)
    inorder(node = this.root, result = []) {
        if (node !== null) {
            this.inorder(node.left, result);
            result.push(node.student);
            this.inorder(node.right, result);
        }
        return result;
    }

    // Search for a student by ID
    searchById(id) {
        return this.searchByIdHelper(this.root, id);
    }

    // Recursive search helper method
    searchByIdHelper(node, id) {
        if (node === null) {
            return null;
        }
        if (node.student.id === id) {
            return node.student;
        } else if (id < node.student.id) {
            return this.searchByIdHelper(node.left, id);
        } else {
            return this.searchByIdHelper(node.right, id);
        }
    }
}

module.exports = BinarySearchTree;
