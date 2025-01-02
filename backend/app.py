from flask import Flask, jsonify, request, session
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user

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


# Function to calculate the discount based on days in advance
def get_discount(days_in_advance):
    if 80 <= days_in_advance <= 90:
        return 30
    elif 60 <= days_in_advance <= 79:
        return 20
    elif 45 <= days_in_advance <= 59:
        return 10
    else:
        return 0


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


# Route to get offers from the database
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
        return jsonify({'message': 'Login successful'})
    
    return jsonify({'message': 'Invalid credentials'}), 401
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['GET'])
def logout():
    logout_user()  # This will log the user out from the session
    return jsonify({'message': 'Logged out successfully'})


@app.route('/api/user', methods=['GET'])
def get_user():
    if current_user.is_authenticated:
        return jsonify({
            'username': current_user.username,
            'email': current_user.email
        })
    else:
        return jsonify({'message': 'Not logged in'}), 401
    

@app.route('/api/change-password', methods=['POST'])
def change_password():
    if not current_user.is_authenticated:
        return jsonify({'message': 'User not authenticated'}), 401

    data = request.json
    new_password = data.get('newPassword')

    if not new_password:
        return jsonify({'message': 'New password is required'}), 400

    # Hash the new password
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Update the password in the database
    cur = mysql.connection.cursor()
    cur.execute("UPDATE users SET password = %s WHERE id = %s", (hashed_password, current_user.id))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Password updated successfully'})



if __name__ == '__main__':
    app.run(debug=True)
