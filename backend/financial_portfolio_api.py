from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from montecarlo import run_monte_carlo  # Import the Monte Carlo simulator

app = Flask(__name__)
api = Api(app,
          version='1.0',
          title='Financial Portfolio API',
          description='API for financial portfolio form submissions')

ns = api.namespace('portfolio', description='Portfolio operations')

# Define expected input model including 'year' (default 10) and optional 'cashflows'
form_model = api.model('PortfolioForm', {
    'income': fields.Float(required=True, description='Annual income'),
    'expenses': fields.Float(required=True, description='Annual expenses'),
    'liabilities': fields.Float(required=True, description='Annual liabilities'),
    'portfolio': fields.Nested(api.model('Portfolio', {
        'equity': fields.Float(required=True, description='Equity allocation'),
        'fixed_income': fields.Float(required=True, description='Fixed Income allocation'),
        'alternatives': fields.Float(required=True, description='Alternatives allocation')
    }), required=True, description='Portfolio details'),
    'current_value': fields.Float(required=True, description='Current portfolio value'),
    'goal': fields.Float(required=True, description='Financial goal value'),
    'year': fields.Integer(required=False, default=10, description='Number of years for simulation'),
    'cashflows': fields.Float(required=False, default=0.0, description='Additional annual cashflows')
})

@ns.route('/submit-form')
class SubmitForm(Resource):
    @ns.expect(form_model)
    def post(self):
        try:
            data = request.get_json()

            # Extract fields from the JSON
            income = data.get('income')
            expenses = data.get('expenses')
            liabilities = data.get('liabilities')
            portfolio = data.get('portfolio')
            current_value = data.get('current_value')
            goal = data.get('goal')
            year = data.get('year', 10)
            cashflows = data.get('cashflows', 0.0)

            # Validate portfolio structure
            if not isinstance(portfolio, dict) or not all(key in portfolio for key in ['equity', 'fixed_income', 'alternatives']):
                api.abort(400, "Portfolio must contain 'equity', 'fixed_income', and 'alternatives' fields")

            # Ensure all required fields are provided (cashflows and year are optional)
            if not all([income is not None, expenses is not None, liabilities is not None, portfolio, current_value is not None, goal is not None]):
                api.abort(400, "All required fields must be provided")

            # Convert portfolio to distribution expected by the montecarlo simulator
            distribution = {
                "equities": portfolio.get('equity'),
                "fixed_income": portfolio.get('fixed_income'),
                "alternatives": portfolio.get('alternatives')
            }

            # Build financials dictionary required by the montecarlo simulator
            financials = {
                "income": income,
                "cashflows": cashflows,
                "expenses": expenses,
                "liabilities": liabilities,
                "current_value": current_value,
                "distribution": distribution
            }

            # Define asset parameters (expected returns and volatilities)
            asset_params = {
                "equities": (0.08, 0.15),
                "fixed_income": (0.035, 0.05),
                "alternatives": (0.05, 0.10)
            }

            # Run the Monte Carlo simulation
            probability, avg_yearly_networth = run_monte_carlo(financials, asset_params, goal, iterations=100, years=year, inflation=0.025)

            simulation_result = {
                "probability": probability,
                "avg_yearly_networth": avg_yearly_networth
            }

            response = {
                "message": "Form submitted successfully",
                "data": {
                    "income": income,
                    "expenses": expenses,
                    "liabilities": liabilities,
                    "portfolio": portfolio,
                    "current_value": current_value,
                    "goal": goal,
                    "year": year,
                    "cashflows": cashflows,
                    "simulation": simulation_result
                }
            }
            return response, 200

        except Exception as e:
            api.abort(500, str(e))

if __name__ == '__main__':
    app.run(debug=True)