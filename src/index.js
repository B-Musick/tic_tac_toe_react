import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from "d3";

class Board extends React.Component {
    state = {}

    drawBoard(){
        // Draw the board squares in the canvas
        let svgCanvas = d3.select('#root').append('svg');
        let tileWidth = 80;
        let fontSize = 40;
        svgCanvas.attr('width',tileWidth*this.props.board.length)
            .attr('height', tileWidth * this.props.board.length);
        
        
        for(let i = 0; i<this.props.board.length; i++){
            for (let j = 0; j < this.props.board.length; j++) {
                
                svgCanvas.append('rect')
                    .attr('x',(tileWidth*j)+'')
                    .attr('y', (tileWidth * i) + '')
                    .attr('width',tileWidth+"")
                    .attr('height',tileWidth+"")
                    .style('fill','black');
                
                if (this.props.board[i][j]){
                    // If the array contains a letter here then print it
                    svgCanvas.append('text')
                        .text(this.props.board[i][j])
                        .attr('x', parseInt(tileWidth) + ((parseInt(tileWidth)) * j) - (parseInt(tileWidth) / 2) - fontSize / 3 + "")
                        .attr('y', parseInt(tileWidth) + ((parseInt(tileWidth)) * i) - (parseInt(tileWidth) / 2) + fontSize / 4 + "")
                        .style('fill', 'blue')
                        .attr('font-size', fontSize + "")
                        .attr('color', 'blue')
                        
                }

                    
                
            }  
        }
    }
    render(){
        this.drawBoard();
        return this.props.board;
    }

}
class App extends React.Component{
    state={
        board:[
            ["X", "X", "O"],
            ["", "O", ""],
            ["X", "", "O"]
        ]
    }

    render(){
        // {console.log(this.state.board)}
        return <Board board={this.state.board}/>;
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
)
