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
    def __init__(self, id, username, email, is_admin=False):
        self.id = id
        self.username = username
        self.email = email
        self.is_admin = is_admin  # New attribute for checking if user is admin

    def is_admin_user(self):
        return self.is_admin


@login_manager.user_loader
def load_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, email, is_admin FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    if user:
        return User(id=user[0], username=user[1], email=user[2], is_admin=user[3])
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
    cur.execute("SELECT id, username, password, email FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    # Check if user exists and password is correct
    if user and bcrypt.check_password_hash(user[2], password):
        remember = data.get('remember', False)  # Check if remember me is true
        user_obj = User(id=user[0], username=user[1], email=user[3])  # Include email in user object
        login_user(user_obj, remember=remember)  # Pass remember flag here
        
        # Store user info in session
        session['user_id'] = user_obj.id  # Store user ID in the session
        
        # Check if the logged-in user is an admin
        if email == 'admin@example.com':
            return jsonify({
                'message': 'Login successful',
                'user': {'id': user_obj.id, 'username': user_obj.username, 'email': user_obj.email},
                'role': 'admin'
            })

        return jsonify({
            'message': 'Login successful',
            'user': {'id': user_obj.id, 'username': user_obj.username, 'email': user_obj.email}
        })

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


@app.route('/api/cart', methods=['GET'])
@login_required
def get_cart():
    cursor = mysql.connection.cursor()

    # Fetch all bookings for the current user, along with hotel name
    cursor.execute("""
        SELECT bookings.id, bookings.user_id, bookings.hotel_id, hotels.name, bookings.status,
               bookings.check_in_date, bookings.check_out_date, bookings.total_price
        FROM bookings
        JOIN hotels ON bookings.hotel_id = hotels.id
        WHERE bookings.user_id = %s
    """, (current_user.id,))
    bookings = cursor.fetchall()

    # If no bookings are found, return an empty list
    if bookings:
        # Format bookings data as needed
        formatted_bookings = [
            {
                "id": booking[0],  # Booking ID
                "hotel": {
                    "name": booking[3],  # Hotel name from hotel table
                },
                "status": booking[4],  # Status of the booking
                "checkInDate": booking[5],  # Check-in date
                "checkOutDate": booking[6],  # Check-out date
                "totalPrice": float(booking[7]),  # Convert total_price to float
            }
            for booking in bookings
        ]
        return jsonify({"bookings": formatted_bookings}), 200
    else:
        return jsonify({"bookings": []}), 200


# Flask Route: confirm_booking
@app.route('/api/confirm_booking', methods=['POST'])
@login_required
def confirm_booking():
    data = request.get_json()
    booking_id = data.get('bookingId')

    if not booking_id:
        return jsonify({"message": "Booking ID is required."}), 400

    cursor = mysql.connection.cursor()
    cursor.execute(
        "UPDATE bookings SET status = 'Confirmed' WHERE id = %s AND user_id = %s AND status = 'Pending'",
        (booking_id, current_user.id)
    )
    mysql.connection.commit()

    if cursor.rowcount == 0:
        return jsonify({"message": "Booking not found or already confirmed."}), 404

    return jsonify({"message": "Booking confirmed!"}), 200





#ADMINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN-----------------


# Route to get all hotels (for Admin)
@app.route('/api/admin/hotels', methods=['GET'])
@login_required
def get_hotels_admin():
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM hotels")
    hotels = cursor.fetchall()
    cursor.close()

    hotel_list = []
    for hotel in hotels:
        hotel_list.append({
            "id": hotel[0],
            "name": hotel[1],
            "description": hotel[2],
            "image": hotel[3],
            "amenities": hotel[4],
            "rating": hotel[5],
            "price": hotel[6],
            "city": hotel[7],
            "room_capacity": hotel[8],
            "standard_rate_peak": hotel[9],
            "standard_rate_off_peak": hotel[10]
        })

    return jsonify(hotel_list)

# Route to add a new hotel (for Admin)
@app.route('/api/admin/hotels', methods=['POST'])
@login_required
def add_hotel():
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    data = request.json
    name = data.get('name')
    description = data.get('description')
    image = data.get('image')
    amenities = data.get('amenities')
    rating = data.get('rating')
    price = data.get('price')
    city = data.get('city')
    room_capacity = data.get('room_capacity')
    standard_rate_peak = data.get('standard_rate_peak')
    standard_rate_off_peak = data.get('standard_rate_off_peak')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO hotels (name, description, image, amenities, rating, price, city, room_capacity, 
        standard_rate_peak, standard_rate_off_peak)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (name, description, image, amenities, rating, price, city, room_capacity, standard_rate_peak, standard_rate_off_peak))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Hotel added successfully"}), 200

# Route to update a hotel (for Admin)
@app.route('/api/admin/hotels/<int:hotel_id>', methods=['PUT'])
@login_required
def update_hotel(hotel_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    data = request.json
    name = data.get('name')
    description = data.get('description')
    image = data.get('image')
    amenities = data.get('amenities')
    rating = data.get('rating')
    price = data.get('price')
    city = data.get('city')
    room_capacity = data.get('room_capacity')
    standard_rate_peak = data.get('standard_rate_peak')
    standard_rate_off_peak = data.get('standard_rate_off_peak')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE hotels SET name = %s, description = %s, image = %s, amenities = %s, rating = %s,
        price = %s, city = %s, room_capacity = %s, standard_rate_peak = %s, standard_rate_off_peak = %s
        WHERE id = %s
    """, (name, description, image, amenities, rating, price, city, room_capacity, standard_rate_peak, standard_rate_off_peak, hotel_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Hotel updated successfully"}), 200

@app.route('/api/admin/hotels/<int:hotel_id>', methods=['DELETE'])
@login_required
def delete_hotel(hotel_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    try:
        cursor = mysql.connection.cursor()

        # Delete bookings associated with the hotel
        cursor.execute("DELETE FROM bookings WHERE hotel_id = %s", (hotel_id,))
        
        # Delete the hotel
        cursor.execute("DELETE FROM hotels WHERE id = %s", (hotel_id,))

        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Hotel and associated bookings deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error deleting hotel", "error": str(e)}), 500


    return jsonify({"message": "Hotel deleted successfully"}), 200
# Route to get all users (for Admin)
@app.route('/api/admin/users', methods=['GET'])
@login_required
def get_users_admin():
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()

    user_list = []
    for user in users:
        user_list.append({
            "id": user[0],
            "username": user[1],
            "email": user[2]
        })

    return jsonify(user_list)

# Route to delete a user (for Admin)
@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    try:
        cursor = mysql.connection.cursor()

        # Delete bookings associated with the user
        cursor.execute("DELETE FROM bookings WHERE user_id = %s", (user_id,))
        
        # Delete the user
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))

        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "User and associated bookings deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error deleting user", "error": str(e)}), 500







if __name__ == '__main__':
    app.run(debug=True)
