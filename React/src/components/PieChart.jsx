import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label} from "recharts"

export default function ListStatusChart(props){
    const chartData = [
        {
        name: 'Playing',
        status: 'playing',
        value: props.stats?.playing || 0
        },
        {
        name: 'Completed',
        status: 'completed',
        value: props.stats?.completed || 0
        },
        {
        name: 'Plan to Play',
        status: 'Plan to Play',
        value: props.stats?.['plan to play'] || 0
        },
        {
        name: 'Dropped',
        status: 'dropped',
        value: props.stats?.dropped || 0
        },
    ]
    const colors = ["hsl(0, 74%, 90%)", "hsl(0, 96%, 29%)", "grey","#333333"]
    const totalGames = chartData.reduce((total, item) => total + item.value, 0)
    if (totalGames === 0) {
        return (
        <section className="profile-chart">
            <h2>Game List Distribution</h2>
            <p>No list data is available yet.</p>
        </section>
        )
    }
    return (
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={115}
              paddingAngle={3}
              onClick={(data) => {
                if (props.onStatusSelect) {
                  props.onStatusSelect(data.status)
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.status}
                  fill={colors[index]}
                />
              ))}
            </Pie>
            <Label
                value={`${totalGames} Games`}
                position="center"
                fill="hsl(0, 96%, 29%)"
                style={{
                fontSize: "18px",
                fontWeight: "bold"
                }}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value} game${value === 1 ? "" : "s"}`,
                name
              ]}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      /* <p className="chart-total">
        Total games: {totalGames}
      </p> */
   
  )

}