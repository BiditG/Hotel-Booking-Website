from flask import Flask, jsonify, request, session
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from datetime import datetime

app = Flask(__name__)

# Enable CORS for the frontend origin (your React app running at http://localhost:5173)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # Replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'Pratima@12345'  # Replace with your MySQL password
app.config['MYSQL_DB'] = 'hotels_db'  # Your database name
app.config['SECRET_KEY'] = '123'  # Replace with a secure key

mysql = MySQL(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email


@login_manager.user_loader
def load_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    if user:
        return User(id=user[0], username=user[1], email=user[2])
    return None


# Route to fetch all hotels
@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM hotels")
    hotels = cur.fetchall()
    cur.close()

    hotel_list = []
    for hotel in hotels:
        hotel_dict = {
            "id": hotel[0],
            "name": hotel[1],
            "description": hotel[2],
            "image": hotel[3],
            "amenities": hotel[4],
            "rating": hotel[5],
            "price": hotel[6],
            "city": hotel[7],  # City field
            "room_capacity": hotel[8],
            "standard_rate_peak": hotel[9],
            "standard_rate_off_peak": hotel[10]
        }
        hotel_list.append(hotel_dict)

    return jsonify(hotel_list)


def get_discount(days_in_advance):
    # Example discount logic based on days_in_advance
    if days_in_advance >= 30:
        return 20  # 20% discount for bookings made 30 days in advance
    elif days_in_advance >= 15:
        return 10  # 10% discount for bookings made 15 days in advance
    elif days_in_advance >= 7:
        return 5  # 5% discount for bookings made 7 days in advance
    else:
        return 0  # No discount for bookings made less than 7 days in advance


@app.route('/api/offers', methods=['GET'])
def get_offers():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM offers")
    offers = cur.fetchall()
    cur.close()

    offer_list = []
    for offer in offers:
        discount_percentage = get_discount(offer[2])  # Assuming the 3rd column is 'days_in_advance'
        discounted_price = offer[3] - (offer[3] * discount_percentage / 100)  # Assuming the 4th column is 'price'
        
        offer_dict = {
            "id": offer[0],
            "title": offer[1],
            "days_in_advance": offer[2],
            "price": offer[3],
            "discount_percentage": discount_percentage,
            "discounted_price": discounted_price,
            "background_image": offer[4]  # Assuming the 5th column is 'background_image'
        }
        offer_list.append(offer_dict)

    return jsonify(offer_list)


# Route for user registration
@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Preflight OK'}), 200

    data = request.json
    username = data['username']
    email = data['email']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'User registered successfully'})


@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Preflight OK'}), 200

    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Fetch user from database
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, password FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    # Check if user exists and password is correct
    if user and bcrypt.check_password_hash(user[2], password):
        remember = data.get('remember', False)  # Check if remember me is true
        user_obj = User(id=user[0], username=user[1], email=email)
        login_user(user_obj, remember=remember)  # Pass remember flag here
        
        # Store user info in session
        session['user_id'] = user_obj.id  # Store user ID in the session
        return jsonify({'message': 'Login successful', 'user': {'id': user_obj.id, 'username': user_obj.username, 'email': user_obj.email}})

    return jsonify({'message': 'Invalid credentials'}), 401


# Route to get user info (check if logged in)
@app.route('/api/user', methods=['GET'])
def get_user():
    if current_user.is_authenticated:
        return jsonify({
            'username': current_user.username,
            'email': current_user.email
        })
    else:
        return jsonify({'message': 'Not logged in'}), 401


# Route to logout
@app.route('/api/logout', methods=['GET'])
def logout():
    logout_user()  # This will log the user out from the session
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/bookings', methods=['GET'])
@login_required
def get_bookings():
    cursor = mysql.connection.cursor()
    
    # Fetch all bookings for the current user
    cursor.execute("SELECT * FROM bookings WHERE user_id = %s", (current_user.id,))
    bookings = cursor.fetchall()

    # If no bookings are found, return an empty list
    if bookings:
        # Format bookings data as needed
        formatted_bookings = [
            {
                "id": booking[0],  # Adjust according to your table schema
                "hotel": {
                    "name": booking[1],  # Example: Adjust based on how hotel data is structured
                    "description": booking[2],
                    "image": booking[3],
                },
                "roomType": booking[4],
                "checkInDate": booking[5],
                "checkOutDate": booking[6],
                "totalPrice": booking[7],
            }
            for booking in bookings
        ]
        return jsonify({"bookings": formatted_bookings}), 200
    else:
        return jsonify({"bookings": []}), 200

# Route for saving a booking
@app.route('/api/bookings', methods=['POST'])
@login_required  # Ensures the route is accessible only for logged-in users
def save_booking():
    print(f"Current User Authenticated: {current_user.is_authenticated}")
    if not current_user.is_authenticated:
        return jsonify({"message": "You must be logged in to make a booking."}), 401

    data = request.json  # Get JSON data sent from React
    hotel_id = data.get('hotel_id')
    room_type = data.get('room_type')
    num_guests = data.get('num_guests')
    total_price = data.get('total_price', 0)
    discount = data.get('discount', 0)
    cancellation_charges = data.get('cancellation_charges', 0)
    check_in_date = datetime.strptime(data.get('check_in_date'), "%Y-%m-%d").date()
    check_out_date = datetime.strptime(data.get('check_out_date'), "%Y-%m-%d").date()

    booking_date = datetime.now().date()
    status = 'Pending'

    cursor = mysql.connection.cursor()
    query = """INSERT INTO bookings (user_id, hotel_id, booking_date, status, cancellation_charge, check_in_date, check_out_date, total_price) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    
    cursor.execute(query, (current_user.id, hotel_id, booking_date, status, cancellation_charges, check_in_date, check_out_date, total_price))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Booking added successfully'}), 200



# Route for viewing booking details
@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
@login_required
def get_booking_details(booking_id):
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT b.id, h.name, b.check_in_date, b.check_out_date, b.total_price, b.status
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.id
        WHERE b.id = %s AND b.user_id = %s
    """, (booking_id, current_user.id))
    booking = cur.fetchone()
    cur.close()

    if booking:
        booking_data = {
            "bookingId": booking[0],
            "hotel_name": booking[1],
            "checkInDate": booking[2],
            "checkOutDate": booking[3],
            "totalPrice": booking[4],
            "status": booking[5]
        }
        return jsonify(booking_data)
    else:
        return jsonify({"message": "Booking not found"}), 404


# Route for canceling a booking
@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@login_required
def cancel_booking(booking_id):
    cursor = mysql.connection.cursor()

    # Check if the booking belongs to the current user
    cursor.execute("SELECT * FROM bookings WHERE id = %s AND user_id = %s", (booking_id, current_user.id))
    booking = cursor.fetchone()

    if booking:
        # Proceed with cancellation
        cursor.execute("DELETE FROM bookings WHERE id = %s", (booking_id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Booking cancelled successfully"}), 200
    else:
        cursor.close()
        return jsonify({"message": "Booking not found or you are not authorized to cancel this booking."}), 404


# Route for processing payments
@app.route('/api/payments', methods=['POST'])
def process_payment():
    try:
        data = request.json
        booking_id = data['bookingId']
        amount = float(data['amount'])
        payment_method = data['paymentMethod']
        payment_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Using MySQLdb without manual connection handling
        cur = mysql.connection.cursor()
        sql = """
        INSERT INTO payments (booking_id, amount, payment_method, payment_date)
        VALUES (%s, %s, %s, %s)
        """
        cur.execute(sql, (booking_id, amount, payment_method, payment_date))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Payment successful"}), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
