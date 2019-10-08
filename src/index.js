import React from 'react';
import ReactDOM from 'react-dom';
// import * as d3 from "d3";

class Tile extends React.Component{
    state = {}

    handleClick=(e)=>{
        e.preventDefault();
        // Pass the index which was clicked up to the Board component to change state
        console.log(this.props.gameOver)
        if (!this.props.gameOver && this.props.letter === ""){
            // If it is an empty space then let a letter be placed at this index
            this.props.handleClick(this.props.index);
        }
        
    }
        
    
    render(){
        let tileWidth=100; // Used to get x and y coordinates, set text alignment
        let xCoord = (this.props.index) % 3 * tileWidth + ""; // modulo since needs to go to 0 when get to next 'row'
        let yCoord = (Math.floor((this.props.index) / 3)) * tileWidth + "";
        let letterColor = this.props.letter === 'X' ? 'rgb(145, 119, 206)' :'rgb(119, 206, 122)'; // Determine color of letter
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
    state = { 
        board: ["", "", "", "", "", "", "", "", ""],
        player: Math.ceil(Math.random() * 10) <= 5 ? true : false,// player1 = true, player2=false
        winningIndices:[
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 5]
        ],
        gameOver: false,
        scores: [0,0]
    }
    componentDidUpdate(nextProps,nextState){
        this.gameOver();
    }
    handleClick=(index)=>{
        
        // Passed into Tile, retrieves tile index when that tile clicked and doesnt contain a letter yet
        let letter = this.state.player ? 'X': 'O'; // This will determine who is playing
        
        this.setState(state => {
            
            let board = state.board.map((tile,i) =>{
                if(index===i){
                    // If the index matches the one clicked then add letter
                    return tile+letter+"";
                }
                return tile;
            });
            // Need this so it returns the array, if just returned what was above,
            // it would return an object with indices mapped out
            let player = !this.state.player; // Change to next player
            return {
                board,
                player
            };  
        });
       
    }

    mapTiles=()=>{       
        // Used to map the tiles to the Canvas
        return this.state.board.map((tileLetter,index)=>{
            
            return <Tile gameOver={this.state.gameOver} index={index} letter={tileLetter} handleClick={this.handleClick} player={this.state.player}/>
        })
    }

    gameOver(){
        /* This will determine if game is over 
        * Someone got a line
        * Board is full and no one wins
        */

        let done = false;
        
        this.state.winningIndices.forEach(array => {
            
            if(!done){
                // If no one has won
                // Loop through all the winning index bundles
                let playerOneWins = array.every(index => {
                    // If all the indices match for player one, they win
                    return this.state.board[index] === 'X';
                });
                let playerTwoWins = array.every(index => {
                    // If all the indices match for player two, they win
                    return this.state.board[index] === 'O';
                });
                if (playerOneWins || playerTwoWins) {
                    
                    // If either player wins, return who won (1 or 2) and return gameOver ===true
                    done = true;
                    

                } else {
                    return false;
                }
            }
        })
        if(done){
            
            // If the game is over then set the score
            this.setState({ gameOver: true, winner: this.state.player ? '1' : '2' },
            this.setWins)
        }
           
       
  

       
       // Passed into Tile component 
    }

    // componentDidUpdate(){
        
        
        
    // }
    reset=()=>{
        
        this.setState({
            player: this.state.player,
            board: ["", "", "", "", "", "", "", "", ""],
            gameOver: false,
            winner: ''
        })

    }
    setWins=()=>{
        
        // console.log(this.state.gameOver+" winner")
        this.setState(state => {
            console.log(state.scores)
            let wins = state.scores.map((player, i) => {
                console.log(player+" "+i)
                if (this.state.winner === ((i + 1) + "")) {
                   console.log('player '+player)
                    // If the index matches the one clicked then add letter
                    return player += 1;
                } else {
                    return player;
                }
            });
            
            // Need this so it returns the array, if just returned what was above,
            // it would return an object with indices mapped out
            return {
                scores: wins,

            };
        })
        if (this.state.gameOver) {
            
                this.reset();
            

           
            
            return false;
        } else {
            return true;
        }
        
        
        
    }

    render(){
        return (
            <div>
                <div>
                    {this.state.scores}
                </div>
                
                    <svg>
                        {this.mapTiles()}
                    </svg>
            </div>

            
        )
    }
}
class Canvas extends React.Component {
    state = {}


    render(){       
        return (
            
                <Board />
           
        );
    }

}

class LoadScreen extends React.Component{
    state={}

    onePlayer=()=>{
        this.props.setPlayers('1');
    }

    twoPlayer=()=> {
        this.props.setPlayers('2');
    }
    render(){
        return (
            <div>
                <div>One Player or Two?</div>
                <button onClick={this.onePlayer}>One</button>
                <button onClick={this.twoPlayer}>Two</button>
            </div>
        )
    }
}
class App extends React.Component{
    state={
        gameStarted: false,
        players: ''
    }

    setPlayers=(players)=>{
        // Passed into LoadScreen component
        // User selects how many players and which letter they want
        this.setState({players})
    }
    render(){
        console.log(this.state.players)
        if(this.state.gameStarted) return <Canvas/>;
        else return <LoadScreen setPlayers={this.setPlayers}/>
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

/*
import React from 'react';
import ReactDOM from 'react-dom';
// import * as d3 from "d3";

class Tile extends React.Component{
    state = {}

    handleClick=(e)=>{
        e.preventDefault();
        // Pass the index which was clicked up to the Board component to change state

        if (!this.props.gameOver.playerWon && this.props.letter === ""){
            // If it is an empty space then let a letter be placed at this index
            this.props.handleClick(this.props.index);
        }

    }


    render(){
        let tileWidth=100; // Used to get x and y coordinates, set text alignment
        let xCoord = (this.props.index) % 3 * tileWidth + ""; // modulo since needs to go to 0 when get to next 'row'
        let yCoord = (Math.floor((this.props.index) / 3)) * tileWidth + "";
        let letterColor = this.props.letter === 'X' ? 'rgb(145, 119, 206)' :'rgb(119, 206, 122)'; // Determine color of letter
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
    state = {
        board: ["", "", "", "", "", "", "", "", ""],
        player: Math.ceil(Math.random() * 10) <= 5 ? true : false,// player1 = true, player2=false
        winningIndices:[
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 5]
        ],
        gameOver: false,
        wins: [0, 0]




    }

    handleClick= (index)=>{

        // Passed into Tile, retrieves tile index when that tile clicked and doesnt contain a letter yet
        let letter = this.state.player ? 'X': 'O'; // This will determine who is playing

        this.setState(state => {

            let board = state.board.map((tile,i) =>{
                if(index===i){
                    // If the index matches the one clicked then add letter
                    return tile+letter+"";
                }
                return tile;
            });
            // Need this so it returns the array, if just returned what was above,
            // it would return an object with indices mapped out
            let player = !this.state.player; // Change to next player
            return {
                board,
                player
            };
        });

    }

    mapTiles=()=>{
        // Used to map the tiles to the Canvas
        return this.state.board.map((tileLetter,index)=>{

            return <Tile gameOver={this.gameOver()} index={index} letter={tileLetter} handleClick={this.handleClick} player={this.state.player}/>
        })
    }

    gameOver(){
        /* This will determine if game is over
        * Someone got a line
        * Board is full and no one wins
        

let playerWon = '';
let done = false;
this.state.winningIndices.forEach(array => {
    if (!done) {
        // If no one has won
        // Loop through all the winning index bundles
        let playerOneWins = array.every(index => {
            // If all the indices match for player one, they win
            return this.state.board[index] === 'X';
        });
        let playerTwoWins = array.every(index => {
            // If all the indices match for player two, they win
            return this.state.board[index] === 'O';
        });
        if (playerOneWins || playerTwoWins) {

            // If either player wins, return who won (1 or 2) and return gameOver ===true
            playerWon = playerOneWins ? '1' : '2';
            done = true;
            this.setState({ gameOver: true })





        } else {
            return true;
        }
    }


})
let gameOver = this.state.gameOver;





return { gameOver, playerWon };
       // Passed into Tile component 
    }
setWins = (winner) => {


    this.setState(state => {

        let wins = state.wins.map((player, i) => {

            if (winner === ((i + 1) + "")) {
                console.log(i)
                // If the index matches the one clicked then add letter
                return player += 1;
            } else {
                return player;
            }

        });
        // Need this so it returns the array, if just returned what was above,
        // it would return an object with indices mapped out

        return {
            wins,
        };
    })

}

componentDidMount(){
    console.log('hi')
    console.log(this.state.gameOver)
    if (this.state.gameOver) {
        console.log(this.state.wins)
    }
}

render(){
    return (
        <svg>
            {this.mapTiles()}
        </svg>
    )
}
}

class Canvas extends React.Component {
    state = {}


    render() {
        return (
            <div>
                <div>{this.state.wins}</div>
                <svg>
                    <Board wins={this.setWins} />
                </svg>
            </div>

        );
    }

}

class App extends React.Component {
    state = {

    }


    render() {
        // console.log(this.state.wins)
        return <Canvas />;
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


*/ 