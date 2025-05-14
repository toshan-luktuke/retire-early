from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        # Parse the incoming JSON data
        data = request.get_json()

        # Extract fields from the JSON
        income = data.get('income')
        expenses = data.get('expenses')
        liabilities = data.get('liabilities')
        portfolio = data.get('portfolio')  # This will be a JSON object
        current_value = data.get('current_value')
        goal = data.get('goal')

        # Validate portfolio structure
        if not isinstance(portfolio, dict) or not all(key in portfolio for key in ['equity', 'fixed_income', 'alternatives']):
            return jsonify({"error": "Portfolio must contain 'equity', 'fixed_income', and 'alternatives' fields"}), 400

        # Perform any processing or validation here
        if not all([income, expenses, liabilities, portfolio, current_value, goal]):
            return jsonify({"error": "All fields are required"}), 400

        # Example response
        response = {
            "message": "Form submitted successfully",
            "data": {
                "income": income,
                "expenses": expenses,
                "liabilities": liabilities,
                "portfolio": portfolio,
                "current_value": current_value,
                "goal": goal
            }
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
    
    

  #git config --global user.email "you@example.com"
 # git config --global user.name "Your Name"