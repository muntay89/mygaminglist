import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RatingDistributionChart(props) {
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    const chartData = ratingValues.map((rating) => {
        const matchedRating = props.ratings?.find((item) => Number(item.rating) === rating)
        return {
            rating,
            label: `${rating}`,
            games: matchedRating?.count ?? 0
        }
    })
    const totalGames = props.ratings?.reduce((total, item) => 
    total + item.count, 0) ?? 0 
    const totalRatings = props.ratings?.reduce((total, item) => 
        total + Number(item.rating) * item.count, 0) ?? 0
    const averageRating = totalGames > 0 ? (totalRatings/ totalGames).toFixed(2) : 'N/A'
     return (
        <>
        <div className="chart-wrapper" style={{paddingTop: '20px'}}>
            <div className="chart-summary">
                <div className="summary-card">
                    <span style={{marginRight: '10px', color: 'hsl(0, 96%, 29%)'}}>Average Rating:</span>
                    <strong>{averageRating}</strong>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 10
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                dataKey="label"
                label={{
                    value: "Rating",
                    position: "insideBottom",
                    offset: -5,
                }}
                />

                <YAxis
                allowDecimals={false}
                label={{
                    value: "Games",
                    angle: -90,
                }}
                />

                <Tooltip
                formatter={(value) => [
                    `${value} game${value === 1 ? "" : "s"}`,
                    "Count"
                ]}
                labelFormatter={(label) =>
                    `${label} stars`
                }
                />

                <Bar
                dataKey="games"
                fill="hsl(0, 96%, 29%)"
                cursor="pointer"
                />
            </BarChart>
            </ResponsiveContainer>
            
        </div>
        </>
    )
}
    
