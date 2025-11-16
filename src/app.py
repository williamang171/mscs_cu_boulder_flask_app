#!/usr/bin/env python3
import requests
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder='dist', static_url_path='')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///breweries.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS for all routes
CORS(app)

db = SQLAlchemy(app)

class Brewery(db.Model):
    __tablename__ = 'breweries'
    
    # Primary key managed by database
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Required fields
    brewery_api_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    
    # Optional fields
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)
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
            'id': self.brewery_api_id,  # Use brewery_api_id as the frontend ID
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
            'street': self.street,
            'is_favorite': self.is_favorite
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
    """Serve the React app in production"""
    return app.send_static_file('index.html')

@app.route("/<path:path>")
def serve_static(path):
    """Serve static files from the React build"""
    try:
        return app.send_static_file(path)
    except:
        # If file not found, serve index.html (for React Router)
        return app.send_static_file('index.html')

@app.route("/echo_user_input", methods=["POST"])
def echo_input():
    input_text = request.form.get("user_input", "")
    return "You entered: " + input_text


def build_brewery_query(base_query, filters):
    """
    Build a SQLAlchemy query with the given filters
    
    Args:
        base_query: Base SQLAlchemy query object
        filters: Dictionary with keys: favorites_only, by_type, by_country, query
    
    Returns:
        Modified SQLAlchemy query object
    """
    # Filter favorites only
    if filters.get('favorites_only'):
        base_query = base_query.filter(Brewery.is_favorite == True)
    
    # Filter by brewery type
    if filters.get('by_type'):
        base_query = base_query.filter(Brewery.brewery_type.ilike(f'%{filters["by_type"]}%'))
    
    # Filter by country
    if filters.get('by_country'):
        base_query = base_query.filter(Brewery.country.ilike(f'%{filters["by_country"]}%'))
    
    # Flexible search across name, city, and state
    if filters.get('query'):
        search_pattern = f'%{filters["query"]}%'
        base_query = base_query.filter(
            db.or_(
                Brewery.name.ilike(search_pattern),
                Brewery.city.ilike(search_pattern),
                Brewery.state.ilike(search_pattern)
            )
        )
    
    return base_query


def parse_search_filters(request_args):
    """
    Parse search filters from request arguments
    
    Args:
        request_args: Flask request.args object
    
    Returns:
        Dictionary with parsed filter values
    """
    return {
        'favorites_only': request_args.get('favorites_only', '').lower() == 'true',
        'by_type': request_args.get('by_type'),
        'by_country': request_args.get('by_country'),
        'query': request_args.get('query')
    }


@app.route("/api/breweries", methods=["GET"])
def search_breweries():
    """
    Search breweries with optional filters
    Query params:
    - by_type: filter by brewery type
    - by_country: filter by country
    - query: flexible search (searches name, city, state)
    - favorites_only: if 'true', return only favorite breweries
    """
    try:
        # Parse filters from request
        filters = parse_search_filters(request.args)
        
        # Build query with filters
        query = build_brewery_query(Brewery.query, filters)
        
        # Execute query and convert to list of dicts
        breweries = query.all()
        result = [brewery.to_dict() for brewery in breweries]
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/api/breweries/<string:brewery_id>", methods=["GET"])
def get_brewery(brewery_id):
    """Get a single brewery by ID"""
    try:
        brewery = Brewery.query.filter_by(brewery_api_id=brewery_id).first()
        
        if not brewery:
            return jsonify({'error': 'Brewery not found'}), 404
        
        return jsonify(brewery.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/api/breweries/<string:brewery_id>/favorite", methods=["POST"])
def toggle_favorite(brewery_id):
    """Toggle favorite status of a brewery"""
    try:
        brewery = Brewery.query.filter_by(brewery_api_id=brewery_id).first()
        
        if not brewery:
            return jsonify({'error': 'Brewery not found'}), 404
        
        # Toggle the favorite status
        brewery.is_favorite = not brewery.is_favorite
        db.session.commit()
        
        return jsonify(brewery.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route("/api/analytics/favorites", methods=["GET"])
def get_favorites_analytics():
    """Get analytics data for favorite breweries"""
    try:
        # Get all favorite breweries
        favorites = Brewery.query.filter_by(is_favorite=True).all()
        
        # Count by type
        type_counts = {}
        for brewery in favorites:
            brewery_type = brewery.brewery_type or 'Unknown'
            type_counts[brewery_type] = type_counts.get(brewery_type, 0) + 1
        
        # Count by country
        country_counts = {}
        for brewery in favorites:
            country = brewery.country or 'Unknown'
            country_counts[country] = country_counts.get(country, 0) + 1
        
        # Count by state (for more granular US data)
        state_counts = {}
        for brewery in favorites:
            if brewery.country == 'United States' and brewery.state:
                state = brewery.state
                state_counts[state] = state_counts.get(state, 0) + 1
        
        # Convert to list format for frontend charts
        type_data = [{'name': k, 'value': v} for k, v in type_counts.items()]
        country_data = [{'name': k, 'value': v} for k, v in country_counts.items()]
        state_data = [{'name': k, 'value': v} for k, v in sorted(state_counts.items(), key=lambda x: x[1], reverse=True)[:10]]  # Top 10 states
        
        return jsonify({
            'total_favorites': len(favorites),
            'by_type': type_data,
            'by_country': country_data,
            'by_state': state_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def get_breweries_from_api():
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
                items = get_breweries_from_api()
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


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)