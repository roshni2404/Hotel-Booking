// import React from 'react'
// import { Link } from 'react-router-dom'

// function Landingscreen() {
//     return (
//         <div className='row landing '>

//             <div className="col-md-12 text-center" >

//                 <h2 style={{ color: 'white', fontSize: '130px' }}>SheyRooms</h2>
//                 <h1 style={{ color: 'white' }}>"This is only one boss. The Guest.</h1>

//                 <Link to='/home'>
//                     <button className='btn landingbtn' style={{ color: 'black' }}>Get Started</button>
//                 </Link>
//             </div>
//         </div >
//     )
// }

// export default Landingscreen




import React from 'react'
import { Link } from 'react-router-dom'

function Landingscreen() {
    return (
        <div className='landing'>
            <div className="landing-content text-center">
                <h2 className='landing-title'>SheyRooms</h2>
                <p className='landing-quote'>“There is only one boss. The Guest.”</p>
                <Link to='/home'>
                    <button className='landingbtn'>Get Started</button>
                </Link>
            </div>
        </div>
    )
}

export default Landingscreen
