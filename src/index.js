import React from 'react';
import ReactDOM from 'react-dom';
// import * as d3 from "d3";

class Tile extends React.Component{
    state = {}

    handleClick=(e)=>{
        e.preventDefault();
        // Pass the index which was clicked up to the Board component to change state
        if(this.props.letter===""){
            // If it is an empty space then let a letter be placed at this index
            this.props.handleClick(this.props.index);
        }
        
    }
        
    
    render(){
        let tileWidth=100;
        let xCoord = (this.props.index) % 3 * tileWidth + "";
        let yCoord = (Math.floor((this.props.index) / 3)) * tileWidth + "";
        let letterColor = this.props.letter === 'X' ? 'red':'green';
        return(
            <g>
                <rect onClick={this.handleClick} id={"tile-" + this.props.index} x={xCoord} y={yCoord}></rect>
                <text textLength={'100px'} x={parseInt(xCoord) + 15 + ""} y={parseInt(yCoord) + (tileWidth-10)  + ""} style={{ fill:letterColor}}>{this.props.letter}</text>
            </g>

        )
    }
}
class Board extends React.Component{
    // This will loop through the board values and pass them to the Tile Components
    state = { board: ["", "", "", "", "", "", "", "", ""]}

    handleClick=(index)=>{
        this.setState(state => {
            console.log(state)
            let board = state.board.map((tile,i) =>{
                if(index===i){
                    return tile+"X";
                }
                return tile;
            });
            // Need this so it returns the array, if just returned what was above,
            // it would return an object with indices mapped out
            return {
                board,
            };
            
            
            

        });
        console.log(this.state.board)
    }
    mapTiles=()=>{
        return this.state.board.map((tileLetter,index)=>{
            console.log(tileLetter)
            return <Tile index={index} letter={tileLetter} handleClick={this.handleClick}/>
        })
    }
    render(){
        return this.mapTiles();
    }
}
class Canvas extends React.Component {
    state = { }


    render(){
        
        return (
            <svg>
                <Board />
            </svg>
        );
    }

}

class App extends React.Component{
    state={
        
    }

    render(){
        
        return <Canvas/>;
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
)


    // drawBoard(){
    //     // Draw the board squares in the canvas
    //     let svgCanvas = d3.select('#root').append('svg');
    //     let tileWidth = 80;
    //     let fontSize = 40;
    //     svgCanvas.attr('width',tileWidth*this.props.board.length)
    //         .attr('height', tileWidth * this.props.board.length);


    //     for(let i = 0; i<this.props.board.length; i++){
    //         for (let j = 0; j < this.props.board.length; j++) {

    //             svgCanvas.append('rect')
    //                 .attr('x',(tileWidth*j)+'')
    //                 .attr('y', (tileWidth * i) + '')
    //                 .attr('width',tileWidth+"")
    //                 .attr('height',tileWidth+"")
    //                 .style('fill','black');

    //             if (this.props.board[i][j]){
    //                 // If the array contains a letter here then print it
    //                 svgCanvas.append('text')
    //                     .text(this.props.board[i][j])
    //                     .attr('x', parseInt(tileWidth) + ((parseInt(tileWidth)) * j) - (parseInt(tileWidth) / 2) - fontSize / 3 + "")
    //                     .attr('y', parseInt(tileWidth) + ((parseInt(tileWidth)) * i) - (parseInt(tileWidth) / 2) + fontSize / 4 + "")
    //                     .style('fill', 'blue')
    //                     .attr('font-size', fontSize + "")
    //                     .attr('color', 'blue')

    //             }



    //         }  
    //     }
    // }

