#!/usr/bin/env python3
import requests
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///breweries.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Brewery(db.Model):
    __tablename__ = 'breweries'
    
    # Primary key managed by database
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Required fields
    brewery_api_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    
    # Optional fields
    brewery_type = db.Column(db.String(50), nullable=True)
    address_1 = db.Column(db.String(255), nullable=True)
    address_2 = db.Column(db.String(255), nullable=True)
    address_3 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state_province = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    website_url = db.Column(db.String(255), nullable=True)
    state = db.Column(db.String(100), nullable=True)
    street = db.Column(db.String(255), nullable=True)
    
    def __repr__(self):
        return f'<Brewery {self.name}>'
    
    def to_dict(self):
        """Convert brewery object to dictionary"""
        return {
            'id': self.id,
            'brewery_api_id': self.brewery_api_id,
            'name': self.name,
            'brewery_type': self.brewery_type,
            'address_1': self.address_1,
            'address_2': self.address_2,
            'address_3': self.address_3,
            'city': self.city,
            'state_province': self.state_province,
            'postal_code': self.postal_code,
            'country': self.country,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'phone': self.phone,
            'website_url': self.website_url,
            'state': self.state,
            'street': self.street
        }
    
    @classmethod
    def from_api_data(cls, data):
        """Create Brewery instance from API JSON data"""
        return cls(
            brewery_api_id=data['id'],
            name=data['name'],
            brewery_type=data.get('brewery_type'),
            address_1=data.get('address_1'),
            address_2=data.get('address_2'),
            address_3=data.get('address_3'),
            city=data.get('city'),
            state_province=data.get('state_province'),
            postal_code=data.get('postal_code'),
            country=data.get('country'),
            longitude=data.get('longitude'),
            latitude=data.get('latitude'),
            phone=data.get('phone'),
            website_url=data.get('website_url'),
            state=data.get('state'),
            street=data.get('street')
        )



@app.route("/")
def main():
    return '''
     <form action="/echo_user_input" method="POST">
         <input name="user_input">
         <input type="submit" value="Submit!">
     </form>
     '''

@app.route("/echo_user_input", methods=["POST"])
def echo_input():
    input_text = request.form.get("user_input", "")
    return "You entered: " + input_text


def get_breweries():
    response = requests.get("https://api.openbrewerydb.org/v1/breweries?per_page=200")
    return response.json()


def initialize_database():
    """Check if database has breweries, if not fetch and populate"""
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check if we have any breweries in the database
        brewery_count = Brewery.query.count()
        
        if brewery_count == 0:
            print("No breweries found in database. Fetching from API...")
            
            try:
                # Fetch breweries from API
                items = get_breweries()
                print(f"Fetched {len(items)} breweries from API")
                
                # Add each brewery to the database
                for item in items:
                    brewery = Brewery.from_api_data(item)
                    db.session.add(brewery)
                
                # Commit all changes
                db.session.commit()
                print(f"Successfully saved {len(items)} breweries to database")
                
            except Exception as e:
                print(f"Error fetching or saving breweries: {e}")
                db.session.rollback()
        else:
            print(f"Database already contains {brewery_count} breweries")


# Init DB when app is running
with app.app_context():
    initialize_database()
