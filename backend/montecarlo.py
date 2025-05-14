import random
from returns import get_asset_return

def simulate_iteration(financials, asset_params, years=10, inflation=0.025):
    # Unpack financials
    current_value = financials['current_value']
    income = financials['income']
    cashflows = financials['cashflows']
    expenses = financials['expenses']
    liabilities = financials['liabilities']
    distribution = financials['distribution']  # e.g., {"equities": 0.6, "fixed_income": 0.3, "alternatives": 0.1}

    # Compute initial net annual contribution
    net_contribution = income + cashflows - expenses - liabilities

    portfolio_value = current_value
    portfolio_history = []

    for year in range(1, years+1):
        # Calculate weighted return based on each asset class simulation using returns.py
        yearly_return = 0.0
        for asset, weight in distribution.items():
            # Use get_asset_return from returns.py
            r = get_asset_return(asset, year)
            yearly_return += weight * r

        # Grow portfolio by market returns and add the year's net contribution
        portfolio_value = portfolio_value * (1 + yearly_return) + net_contribution

        # Append portfolio value at the end of this year
        portfolio_history.append(portfolio_value)

        # Increase the net contribution by inflation each year
        net_contribution *= (1 + inflation)

    return portfolio_value, portfolio_history

def run_monte_carlo(financials, asset_params, goal, iterations=100, years=10, inflation=0.025):
    success_count = 0
    # For averaging yearly net worth, create a list of accumulators for each year.
    aggregate_years = [0.0] * years

    # Adjust the goal for inflation over the simulation years.
    inflated_goal = goal * ((1 + inflation) ** years)

    for _ in range(iterations):
        final_value, history = simulate_iteration(financials, asset_params, years, inflation)
        if final_value >= inflated_goal:
            success_count += 1
        # Sum each year's portfolio value for later averaging.
        for i in range(years):
            aggregate_years[i] += history[i]

    probability = success_count / iterations
    # Compute the average net worth for each year over all iterations.
    avg_yearly_networth = [total / iterations for total in aggregate_years]
    return probability, avg_yearly_networth

def main():
    print("Monte Carlo Simulator for Financial Goals\n")
    try:
        income = float(input("Enter annual income: "))
        cashflows = float(input("Enter additional annual cashflows: "))
        expenses = float(input("Enter annual expenses: "))
        liabilities = float(input("Enter annual liabilities: "))
        current_value = float(input("Enter current portfolio value: "))
        goal = float(input("Enter your financial goal value (in today's dollars): "))
        years = int(input("Enter the number of years for the simulation: "))
        
        print("\nEnter portfolio distribution percentages as decimals (they must sum to 1).")
        equities = float(input("Enter allocation for equities (e.g., 0.6): "))
        fixed_income = float(input("Enter allocation for fixed income (e.g., 0.3): "))
        alternatives = float(input("Enter allocation for alternatives (e.g., 0.1): "))
        
        distribution = {
            "equities": equities,
            "fixed_income": fixed_income,
            "alternatives": alternatives
        }
    except ValueError:
        print("Invalid input. Please enter numerical values.")
        return
    
    # Define asset expected return and volatility parameters.
    asset_params = {
        "equities": (0.08, 0.15),
        "fixed_income": (0.035, 0.05),
        "alternatives": (0.05, 0.10)
    }
    
    financials = {
        "income": income,
        "cashflows": cashflows,
        "expenses": expenses,
        "liabilities": liabilities,
        "current_value": current_value,
        "distribution": distribution
    }
    
    iterations = 100
    inflation = 0.025
    probability, avg_yearly_networth = run_monte_carlo(financials, asset_params, goal, iterations, years, inflation)
    
    print(f"\nAfter {iterations} Monte Carlo iterations:")
    print(f"Probability of reaching the {years}-year goal (inflation-adjusted): {probability*100:.1f}%")
    print("\nAverage net worth per year across all iterations:")
    for year, value in enumerate(avg_yearly_networth, start=1):
        print(f"Year {year}: {value:,.2f}")

if __name__ == "__main__":
    main()
