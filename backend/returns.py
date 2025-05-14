import random

# Expected return and standard deviation for each asset class under standard market conditions.
# Note: Using a normal distribution (random.gauss) allows for negative returns.
ASSET_PARAMS = {
    "equities": (0.08, 0.15),
    "fixed_income": (0.035, 0.05),
    "alternatives": (0.05, 0.10)
}

def get_asset_return(asset, year):
    """
    Get a simulated return for a given asset class for a specified year.

    Args:
        asset (str): The asset class ("equities", "fixed_income", or "alternatives").
        year (int): The year for which to simulate the return.
                    (Currently not used to modify the return; included for future adjustments.)
                    
    Returns:
        float: The simulated annual return as a decimal (e.g., 0.08 for 8%). Negative returns are allowed.
    """
    if asset not in ASSET_PARAMS:
        raise ValueError("Invalid asset type. Expected one of: equities, fixed_income, alternatives")
        
    mean, std_dev = ASSET_PARAMS[asset]
    return random.gauss(mean, std_dev)

def get_all_returns(year):
    """
    Get simulated returns for all asset classes for a given year.

    Args:
        year (int): The year for which to simulate the returns.
    
    Returns:
        dict: A dictionary with keys for each asset class and their simulated returns.
    """
    returns = {}
    for asset in ASSET_PARAMS:
        returns[asset] = get_asset_return(asset, year)
    return returns

if __name__ == "__main__":
    # Example usage: Simulate and print the returns for a given year.
    year = 1  # You can change this to any desired year.
    simulated_returns = get_all_returns(year)
    print(f"Simulated returns for year {year}:")
    for asset, ret in simulated_returns.items():
        print(f"{asset}: {ret*100:.2f}%")