from flask import Flask, jsonify, request, session,send_file
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from datetime import datetime, timedelta
from fpdf import FPDF
from io import BytesIO

app = Flask(__name__)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)  # Adjust as needed

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
    address = data['address']  # New address field
    postalcode = data['postalCode']  # New postalCode field

    # Insert new user into the database with address and postalCode fields
    cur = mysql.connection.cursor()
    cur.execute(
        "INSERT INTO users (username, email, password, address, postalcode) VALUES (%s, %s, %s, %s, %s)",
        (username, email, password, address, postalcode)
    )
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'User registered successfully'})


@app.route('/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    # Check if email already exists in the database
    cur = mysql.connection.cursor()
    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if user:
        return jsonify({'exists': True})
    else:
        return jsonify({'exists': False})



# Route to login
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
        remember = data.get('remember', False)  # Get "remember" value from the request data
        user_obj = User(id=user[0], username=user[1], email=user[3])  # Include email in user object
        login_user(user_obj, remember=remember)  # Pass remember flag here

        # If "Remember Me" is selected, we set the session as permanent
        if remember:
            session.permanent = True  # Ensures session remains persistent
            app.permanent_session_lifetime = timedelta(days=30)  # Set the expiration time for permanent sessions
        else:
            session.permanent = False  # Ensures non-permanent session for un-checked "Remember Me"

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
    logout_user() 
    session.clear() # This will log the user out from the session
    return jsonify({'message': 'Logged out successfully'})


@app.route('/api/change-password', methods=['POST'])
@login_required  # Ensure the user is logged in
def change_password():
    data = request.get_json()
    print(data)

    # Check if the new password is provided
    new_password = data.get('newPassword')
    if not new_password:
        return jsonify({'message': 'New password is required'}), 400


    # Hash the new password using bcrypt
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    try:
        # Update the user's password in the database
        cur = mysql.connection.cursor()
        cur.execute("UPDATE users SET password = %s WHERE id = %s", (hashed_password, current_user.id))
        mysql.connection.commit()
        cur.close()

        # Optionally log the user out after a password change, forcing a re-login
        logout_user()

        return jsonify({'message': 'Password updated successfully'}), 200
    except Exception as e:
        print(f"Error updating password: {e}")
        return jsonify({'message': 'Failed to update password'}), 500

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
                "totalPrice": float(booking[7]) if booking[7] is not None else 0.0,  # Handle None for total_price
            }
            for booking in bookings
        ]
        return jsonify({"bookings": formatted_bookings}), 200
    else:
        return jsonify({"bookings": []}), 200

@app.route('/api/bookings/<int:booking_id>/receipt', methods=['GET'])
@login_required
def download_receipt(booking_id):
    cursor = mysql.connection.cursor()

    # Fetch booking details along with user information (username, email)
    cursor.execute("""
        SELECT bookings.id, hotels.name, bookings.status, bookings.check_in_date, 
               bookings.check_out_date, bookings.total_price, users.username, users.email
        FROM bookings
        JOIN hotels ON bookings.hotel_id = hotels.id
        JOIN users ON bookings.user_id = users.id
        WHERE bookings.id = %s AND bookings.user_id = %s
    """, (booking_id, current_user.id))
    booking = cursor.fetchone()

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Create PDF receipt with refined design
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Set Title font for the header
    pdf.set_font("Arial", 'B', 18)
    pdf.cell(200, 10, txt="Booking Receipt", ln=True, align='C')
    
    # Add a separator line below the title
    pdf.set_line_width(0.5)
    pdf.line(10, 20, 200, 20)
    
    pdf.ln(10)

    # Hotel and Booking Details Section (with borders)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="Hotel & Booking Details", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt=f"""
        Hotel Name: {booking[1]}
        Booking ID: {booking[0]}
        Booking Status: {booking[2]}
        Check-in Date: {booking[3]}
        Check-out Date: {booking[4]}
        Total Price: ${booking[5]:.2f}
    """)
    


    # User Information Section (separate with line)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(200, 10, txt="User Information", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt=f"""
        Username: {booking[6]}
        Email: {booking[7]}
    """)


    # Add a footer with the current date and time
    pdf.set_y(-25)
    pdf.set_font("Arial", 'I', 10)
    pdf.cell(0, 10, txt=f"Receipt generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", align='C')

    # Add a subtle line at the bottom (footer separator)
    pdf.set_line_width(0.5)
    pdf.line(10, 290, 200, 290)

    # Optional: Add contact info or company branding (like logo) here if necessary
    # pdf.image('path_to_logo.png', 10, 8, 33)  # For logo, adjust position and size

    # Save PDF to memory (as a byte stream)
    pdf_output = BytesIO()
    pdf_data = pdf.output(dest='S').encode('latin1')  # Use 'S' to return the PDF as a string
    pdf_output.write(pdf_data)
    pdf_output.seek(0)

    # Send the PDF as a downloadable file
    return send_file(pdf_output, as_attachment=True, download_name=f"receipt_{booking_id}.pdf", mimetype="application/pdf")

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


# Currency Model - Fetch currencies from MySQL database
@app.route('/api/currencies', methods=['GET'])
def get_currencies():
    cur = mysql.connection.cursor()
    cur.execute("SELECT currency_code, rate FROM currency")
    currencies = cur.fetchall()
    
    # Format data for JSON response
    currency_list = [{"currency_code": currency[0], "rate": str(currency[1])} for currency in currencies]
    return jsonify(currency_list)

# Fetch a specific currency rate by currency code (e.g., /api/currencies/USD)
@app.route('/api/currencies/<currency_code>', methods=['GET'])
def get_currency(currency_code):
    cur = mysql.connection.cursor()
    cur.execute("SELECT currency_code, rate FROM currency WHERE currency_code = %s", (currency_code.upper(),))
    currency = cur.fetchone()

    if currency:
        return jsonify({"currency_code": currency[0], "rate": str(currency[1])})
    else:
        return jsonify({"error": "Currency not found"}), 404

# Update exchange rate for a specific currency
@app.route('/api/currencies/<currency_code>', methods=['PUT'])
def update_currency(currency_code):
    new_rate = request.json.get('rate')
    if not new_rate:
        return jsonify({"error": "Rate is required"}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute("UPDATE currency SET rate = %s WHERE currency_code = %s", (new_rate, currency_code.upper()))
        mysql.connection.commit()
        return jsonify({"message": "Currency rate updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
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
            "standard_rate_off_peak": hotel[10],
            "status": hotel[11]
        })

    return jsonify(hotel_list)

@app.route('/api/admin/hotels', methods=['POST'])
@login_required
def add_hotel():
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    data = request.json
    
    # Extract and validate data
    required_fields = ['name', 'description', 'image', 'amenities', 'rating', 'price', 'city', 'room_capacity', 'standard_rate_peak', 'standard_rate_off_peak', 'status']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing required field: {field}"}), 400
    
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
    status = data.get('status')

    cursor = mysql.connection.cursor()
    
    try:
        # Ensure the query uses the correct number of placeholders and values
        cursor.execute("""
            INSERT INTO hotels (name, description, image, amenities, rating, price, city, room_capacity, 
            standard_rate_peak, standard_rate_off_peak, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (name, description, image, amenities, rating, price, city, room_capacity, standard_rate_peak, standard_rate_off_peak, status))

        mysql.connection.commit()
        return jsonify({"message": "Hotel added successfully"}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"message": f"Error adding hotel: {str(e)}"}), 500
    finally:
        cursor.close()


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
    
    # Get status, default to 'available' if not provided
    status = data.get('status', 'available')
    
    # Debugging: Print out status value to make sure it's correct
    print(f"Status being updated: {status}")
    
    # Validate status value
    if status not in ['available', 'packed']:
        return jsonify({"error": "Invalid status value"}), 400
    
    cursor = mysql.connection.cursor()
    cursor.execute("""
        UPDATE hotels SET name = %s, description = %s, image = %s, amenities = %s, rating = %s,
        price = %s, city = %s, room_capacity = %s, standard_rate_peak = %s, standard_rate_off_peak = %s, status = %s
        WHERE id = %s
    """, (name, description, image, amenities, rating, price, city, room_capacity, standard_rate_peak, standard_rate_off_peak, status, hotel_id))
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


@app.route('/api/admin/users/<int:user_id>/password', methods=['PUT'])
@login_required
def update_user_password(user_id):
    # Ensure that the logged-in user is an admin
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    # Admins can update passwords for any user
    try:
        # Get the new password from the request data
        new_password = request.json.get('password')

        if not new_password or len(new_password) < 6:  # Optional: enforce a password length requirement
            return jsonify({"message": "Password must be at least 6 characters long."}), 400

        # Hash the new password using Bcrypt
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        cursor = mysql.connection.cursor()

        # Update the user's password in the database
        cursor.execute("UPDATE users SET password = %s WHERE id = %s", (hashed_password, user_id))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Password updated successfully."}), 200
    except Exception as e:
        print(e)  # It's a good practice to log the error
        return jsonify({"message": "An error occurred while updating the password."}), 500


# Route to update user details (username, email) for Admin
@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@login_required
def update_user_details(user_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "Admin must be logged in."}), 401

    try:
        # Get the new user details from the request data
        new_username = request.json.get('username')
        new_email = request.json.get('email')
        new_password = request.json.get('password', None)  # Optional password field

        if not new_username or not new_email:
            return jsonify({"message": "Username and email are required."}), 400

        cursor = mysql.connection.cursor()

        # Prepare the SQL query for updating user details
        if new_password:  # If a password is provided, include it in the update
            hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            cursor.execute("UPDATE users SET username = %s, email = %s, password = %s WHERE id = %s", 
                           (new_username, new_email, hashed_password, user_id))
        else:
            cursor.execute("UPDATE users SET username = %s, email = %s WHERE id = %s", 
                           (new_username, new_email, user_id))
        
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "User details updated successfully."}), 200
    except Exception as e:
        print(e)  # Log the error for debugging
        return jsonify({"message": "An error occurred while updating the user details.", "error": str(e)}), 500



@app.route('/api/admin/dashboard', methods=['GET'])
@login_required
def get_dashboard_data():
    cur = mysql.connection.cursor()

    # 1. Calculate the total amount of sales done, treating NULL total_price as 0
    cur.execute('''
        SELECT SUM(IFNULL(total_price, 0)) 
        FROM bookings 
        WHERE status IN ('Confirmed', 'Pending') 
        AND total_price IS NOT NULL
    ''')
    total_sales = cur.fetchone()[0] or 0  # Default to 0 if None is returned
    print(f"Total Sales: {total_sales}")

    # 2. Fetch usernames ordered by highest amount paid
    cur.execute('''
        SELECT u.username, SUM(IFNULL(b.total_price, 0)) as total_amount 
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE b.status IN ('Confirmed', 'Pending')
        GROUP BY u.username
        ORDER BY total_amount DESC
    ''')
    users = cur.fetchall()
    print(f"Users: {users}")

    # 3. Fetch hotel names ordered by highest amount received
    cur.execute('''
        SELECT h.name, SUM(IFNULL(b.total_price, 0)) as total_amount 
        FROM bookings b
        JOIN hotels h ON b.hotel_id = h.id
        WHERE b.status IN ('Confirmed', 'Pending')
        GROUP BY h.name
        ORDER BY total_amount DESC
    ''')
    hotels = cur.fetchall()
    print(f"Hotels: {hotels}")

    # Close the cursor
    cur.close()

    # Prepare the response data, replacing None with 0.0
    users_data = [{'username': user[0], 'total_amount': float(user[1]) if user[1] is not None else 0.0} for user in users]
    hotels_data = [{'hotel_name': hotel[0], 'total_amount': float(hotel[1]) if hotel[1] is not None else 0.0} for hotel in hotels]

    return jsonify({
        'total_sales': total_sales,
        'users': users_data,
        'hotels': hotels_data
    })

@app.route('/api/admin/offers/<int:offer_id>', methods=['PUT'])
@login_required  # Ensure the user is logged in
def update_offer(offer_id):
    data = request.get_json()

    # Get offer details from the request body
    title = data.get('title')
    price = data.get('price')
    discount_percentage = data.get('discount_percentage')
    discounted_price = data.get('discounted_price')
    background_image = data.get('background_image')
    days_in_advance = data.get('days_in_advance')  # Ensure that days_in_advance is included

    if not title or not price or not discount_percentage or not discounted_price or not background_image or not days_in_advance:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        # Update the offer details in the database
        cursor = mysql.connection.cursor()
        cursor.execute("""
            UPDATE offers
            SET title = %s, price = %s, discount_percentage = %s, discounted_price = %s, background_image = %s, updated_at = %s, days_in_advance = %s
            WHERE id = %s
        """, (title, price, discount_percentage, discounted_price, background_image, datetime.now(), days_in_advance, offer_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Offer updated successfully"}), 200

    except Exception as e:
        print(f"Error updating offer: {str(e)}")  # Log the error to the console for debugging
        return jsonify({"message": "Error updating offer", "error": str(e)}), 500

@app.route('/api/admin/sales_data', methods=['GET'])
@login_required  # Ensure the user is logged in
def get_sales_data():
    try:
        cursor = mysql.connection.cursor()

        # Fetch sales over time data from the sales_over_time table
        cursor.execute("""
            SELECT sale_date, total_sales FROM sales_over_time
        """)
        sales_over_time = cursor.fetchall()

        # Return the sales data in JSON format
        sales_data = [{"date": sale[0], "sales": sale[1]} for sale in sales_over_time]

        cursor.close()

        return jsonify({"sales_over_time": sales_data}), 200

    except Exception as e:
        return jsonify({"message": "Error fetching sales data", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
