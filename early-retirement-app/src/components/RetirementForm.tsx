import React, { useState } from 'react';
import RetirementChart from './RetirementChart';
import '../styles/RetirementForm.css';
import '../styles/App.css';

const RetirementForm: React.FC = () => {
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState('');
    const [cashFlows, setCashFlows] = useState('');
    const [liabilities, setLiabilities] = useState('');
    const [portfolioValue, setPortfolioValue] = useState('');
    const [equityAllocation, setEquityAllocation] = useState(''); // entered as 100% format
    const [fixedIncomeAllocation, setFixedIncomeAllocation] = useState('');
    const [otherAllocation, setOtherAllocation] = useState('');
    const [goal, setGoal] = useState('');
    const [goalYears, setGoalYears] = useState('');

    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState<any>(null);
    const [probability, setProbability] = useState<number | null>(null);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Convert allocation percentages (UI as whole numbers) to 0-1 scale
        const formData = {
            income: Number(income),
            expenses: Number(expenses),
            liabilities: Number(liabilities),
            portfolio: {
                equity: Number(equityAllocation) / 100,
                fixed_income: Number(fixedIncomeAllocation) / 100,
                alternatives: Number(otherAllocation) / 100,
            },
            current_value: Number(portfolioValue),
            goal: Number(goal),
            year: Number(goalYears),
            cashflows: Number(cashFlows)
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/portfolio/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const simulation = data.data.simulation;
            // Multiply probability (returned in 0-1 scale) by 100 to convert for display purposes
            setProbability(simulation.probability * 100);

            // Build chart data using avg_yearly_networth array
            const labels = simulation.avg_yearly_networth.map((_: number, i: number) => `Year ${i + 1}`);
            setChartData({
                labels,
                datasets: [{
                    label: 'Average Yearly Net Worth',
                    data: simulation.avg_yearly_networth,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                }]
            });
        } catch (error) {
            console.error('Error fetching retirement data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="retirement-container">
            <div className="form-section">
                <form className="retirement-form" onSubmit={handleCalculate}>
                    <h2>Retirement Planning Form</h2>

                    <div>
                        <label>
                            Annual Income (₹):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Annual Expenses (₹):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Annual Cash Flows (₹):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={cashFlows} onChange={(e) => setCashFlows(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Annual Liabilities (₹):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Portfolio Current Value (₹):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={portfolioValue} onChange={(e) => setPortfolioValue(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Equity Allocation (%):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={equityAllocation} onChange={(e) => setEquityAllocation(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Fixed Income Allocation (%):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={fixedIncomeAllocation} onChange={(e) => setFixedIncomeAllocation(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Other Allocation (%):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={otherAllocation} onChange={(e) => setOtherAllocation(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Goal Amount (₹):<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} required />
                    </div>

                    <div>
                        <label>
                            Goal Years:<span className="required-mark">*</span>
                        </label>
                        <input type="number" value={goalYears} onChange={(e) => setGoalYears(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Calculating...' : 'Calculate'}
                    </button>
                </form>
            </div>
            <div className="chart-section">
                {loading && (
                    <div className="loading-indicator">
                        <p>Calculating data... please wait.</p>
                    </div>
                )}

                {chartData && probability !== null && (
                    <RetirementChart chartData={chartData} probability={probability} />
                )}
            </div>
        </div>
    );
};

export default RetirementForm;