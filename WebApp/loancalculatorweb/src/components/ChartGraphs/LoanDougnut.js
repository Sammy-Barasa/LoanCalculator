import React from 'react'
import { VictoryPie } from "victory";

function LoanDougnut({data}) {

  return (
    <div>
        <VictoryPie
    height={500}
    width={400}
  padAngle={5}
  innerRadius={100}
  
//   animate={{ duration: 2000 }}
  colorScale={["tomato", "orange", "gold" ]}
/>
    </div>
    
  )
}

export default LoanDougnut



