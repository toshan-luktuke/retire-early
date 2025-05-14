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
    const [equityAllocation, setEquityAllocation] = useState('');
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

        const formData = {
            income,
            expenses,
            cashFlows,
            liabilities,
            portfolioValue,
            equityAllocation,
            fixedIncomeAllocation,
            otherAllocation,
            goal,
            goalYears,
        };

        try {
            // Replace with your actual API endpoint
            const response = await fetch('https://your-api-endpoint.com/retirement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            // Expected API response format:
            // { probability: number, chartData: { labels: string[], datasets: [...] } }
            setProbability(data.probability);
            setChartData(data.chartData);
        } catch (error) {
            console.error('Error fetching retirement data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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

            {loading && (
                <div className="loading-indicator">
                    <p>Calculating data... please wait.</p>
                </div>
            )}

            {chartData && probability !== null && (
                <RetirementChart chartData={chartData} probability={probability} />
            )}
        </div>
    );
};

export default RetirementForm;