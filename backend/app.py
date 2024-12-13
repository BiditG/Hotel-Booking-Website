from flask import Flask, jsonify 

from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  




app = Flask(__name__)

# Database configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Pratima@12345",
    "database": "WHBooking",
}

# Establish a database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None


@app.route('/')
def home():
    return "Welcome to WHBooking API!"


# Fetch all customers
@app.route('/customers', methods=['GET'])
def get_customers():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Customers")
    customers = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(customers)


# Add a new customer
@app.route('/customers', methods=['POST'])
def add_customer():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    query = """
        INSERT INTO Customers (Name, Email, Password, Phone)
        VALUES (%s, %s, %s, %s)
    """
    values = (data["Name"], data["Email"], data["Password"], data["Phone"])
    cursor.execute(query, values)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Customer added successfully!"})


# Fetch a single customer
@app.route('/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Customers WHERE Customer_ID = %s", (customer_id,))
    customer = cursor.fetchone()
    cursor.close()
    conn.close()
    if customer:
        return jsonify(customer)
    else:
        return jsonify({"error": "Customer not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)

