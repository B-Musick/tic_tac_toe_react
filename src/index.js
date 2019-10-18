import React from 'react';
import ReactDOM from 'react-dom';
// import * as d3 from "d3";

class Tile extends React.Component{
    state = {}

    handleClick=(e)=>{
        e.preventDefault();
        // Pass the index which was clicked up to the CANVAS component to change state
        
        if (!this.props.gameOver && this.props.letter === ""){
            // If it is an empty space then let a letter be placed at this index
            // Also this only occurs if the game isnt over
            this.props.handleClick(this.props.index);
        }
        
    }
        
    
    render(){
        let tileWidth=100; // Used to get x and y coordinates, set text alignment
        let xCoord = (this.props.index) % 3 * tileWidth + ""; // modulo since needs to go to 0 when get to next 'row'
        let yCoord = (Math.floor((this.props.index) / 3)) * tileWidth + "";
        let letterColor = this.props.letter === 'X' ? 'rgb(145, 119, 206)' :'rgb(119, 206, 122)'; // Determine color of letter
        return(
            // Set the tile rectangle into the canvas to proper x and y coordinates
            // Give specific id based on index
            <g>
                <rect onClick={this.handleClick} id={"tile-" + this.props.index} x={xCoord} y={yCoord}></rect>
                <text textLength={'100px'} x={parseInt(xCoord) + 15 + ""} y={parseInt(yCoord) + (tileWidth-10)  + ""} style={{ fill:letterColor}}>{this.props.letter}</text>
            </g>
        )
    }
}

/******************************** CANVAS COMPONENT **************************** */
class Canvas extends React.Component{
    // This will loop through the board values and pass them to the Tile Components
    state = { 
        /**
         * board - Holds letters, called in mapTiles
         */
        board: ["", "", "", "", "", "", "", "", ""], 
        player: this.props.player,// player1 = true, player2=false, passed in from App
        winningIndices:[
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ], //
        gameOver: false,
        scores: [0,0],
        players: this.props.players, 
        singlePlayer: this.props.singlePlayer // Set when user clicks player amount
    }

    componentDidUpdate(prevProps,prevState){      
        let currentPlayer = this.state.player ? 'X':'O'
      
        if ((this.state.players === '1') && (this.state.singlePlayer !== currentPlayer)){
            this.computersTurn();
        }
    }
    handleClick=(index)=>{
        /* Passed into Tile, retrieves tile index when that tile clicked and doesnt contain a letter yet
        * Finds the tile which was clicked and adds letter to this index
        */
       if(!this.state.gameOver){
           let letter = this.state.player ? 'X' : 'O'; // This will determine who is playing

           this.setState(state => {

               let board = state.board.map((tile, i) => {
                   if (index === i) {
                       // If the index matches the one clicked then add letter
                       return tile + letter + "";
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
           }, this.gameOver);
       }
    }

    computersTurn(){
        /*
        * Called from componentDidUpdate()
        * When its computers turn
        */
        let emptySpaces = [] // Saves empty index values
        this.state.board.forEach((value,index)=>{
            // Go through board and find empty spaces
            if(value === ''){
                emptySpaces.push(index);
            }
        });
        // Get random index for computer to put next play
        let randomIndex = Math.floor(Math.random()*emptySpaces.length)

        // Pass the index to handleClick for computer turn
        // Allow one second leeway for turn
        setTimeout(()=>[
            this.handleClick(emptySpaces[randomIndex])
        ],1000)
        

        }
    
    /***** MAP TILES *****/

    mapTiles=()=>{
              
        // Used to map the tiles to the Canvas
        return this.state.board.map((tileLetter,index)=>{
            
            return <Tile gameOver={this.state.gameOver} index={index} letter={tileLetter} handleClick={this.handleClick} player={this.state.player}/>
        })
    }

    /***** GAME OVER *****/

    gameOver=()=>{
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
        }else if(this.state.board.every(tile=>tile!=='')){
            // If no one wins and board is full
            setTimeout(()=>{
                this.reset()
            },2000)
            
        }

       // Passed into Tile component 
    }

    /***** RESET *****/
    /**
     * Set the next player to whom lost
     * Reset the board
     * Change gameOver to false and the new screen renders
     * Set winner to empty
     */
    reset=()=>{

        this.setState({
            player: this.state.winner === 'X' ? 'O':'X', 
            board: ["", "", "", "", "", "", "", "", ""],
            gameOver: false,
            winner: ''
        })

    }

    /***** SET WINS *****/
    /**
     * Called from this.gameOver()
     */
    setWins=()=>{
        this.setState(state => {
            let wins = state.scores.map((player, i) => {
                if (this.state.winner === ((i + 1) + "")) {
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
    }

    render(){
        if(this.state.gameOver){
            // If game is over then ask if they want to play again
            return (
                <div id="full-page-container">
                    <div id="tic-title">TIC TAC TOE</div>
                    <div id="left-column">
                        
                        <svg>
                            {this.mapTiles()}
                        </svg>
                    </div>
                    <div id="right-column">
                        <div id="player-score-container">
                            <div>CURRENT PLAYER: {this.state.player ? 'X' : 'O'}</div>
                            <div id="scores-container">
                                <div id="player-x-score">
                                    <div>PLAYER X</div>
                                    <div>
                                        {this.state.scores[1]}
                                    </div>
                                </div>
                                <div id="player-y-score">
                                    <div>PLAYER O</div>
                                    <div>
                                        {this.state.scores[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="winner-addition-container">
                            <div id="player-wins-container">PLAYER {this.state.winner === '2' ? 'X' : 'O'} WINS!</div>
                            <div>PLAY AGAIN?</div>
                            <div id="win-buttons">
                                <button onClick={this.reset}>YES</button>
                                <button>NO</button>
                            </div>

                        </div>

                    </div>
                </div>

            )
        }else{
            // When game is started, remove the play again? text and who won
            return (
                <div id="full-page-container">
                    <div id="tic-title">TIC TAC TOE</div>
                    <div id="left-column">
                        

                        <svg>
                            {this.mapTiles()}
                        </svg>
                    </div>
                    <div id="right-column">
                        <div id="player-score-container">
                            <div>CURRENT PLAYER: {this.state.player ? 'X' : 'O'}</div>
                            <div id="scores-container">
                                <div id="player-x-score">
                                    <div>PLAYER X</div>
                                    <div>
                                        {this.state.scores[1]}
                                    </div>
                                </div>
                                <div id="player-y-score">
                                    <div>PLAYER O</div>
                                    <div>
                                        {this.state.scores[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }
    }
}

/*************************** LOADPLAYER COUNT COMPONENT ********************** */
/**
 * First loaded component from App
 * Returns the amount of players playing
 * Passes response throught 'setPlayer' which is a method in the App component 
 * where it will load
 */
class LoadScreen extends React.Component{
    
    state={}

    onePlayer=()=>{
        // Sets player amount to 1
        this.props.setPlayers('1');
    }

    twoPlayer=()=> {
        // Sets player amount to 2

        this.props.setPlayers('2');
    }
    render(){
        return (
            <div id="player-number">
                <div id="player-number-inside">
                    <div>ONE OR TWO PLAYERS?</div>
                    <div id="player-number-buttons">
                        <button onClick={this.onePlayer}>ONE</button>
                        <button onClick={this.twoPlayer}>TWO</button>
                    </div>

                </div>

            </div>
        )
    }
}

/*************************** SELECT LETTER COMPONENT ********************** */
/**
 * Second component loaded, lets user select the letter they want
 * Loaded in App
 * Passes response back to App through 'setLetter'
 */
class SelectLetter extends React.Component{
    state={}

    playerX=()=>{
        // Player X starts as true
        this.props.setLetter(true);
    }

    playerO=()=> {
        // Player O starts as false
        this.props.setLetter(false);
    }

    random=()=>{
        // Set the player to random letter
        return Math.ceil(Math.random() * 10) <= 5 ? this.playerX() : this.playerO();
    }

    render(){
        return(
            <div id="player-number">
                <div id="player-number-inside">
                    <div>Which letter is player 1?</div>
                    <div id="player-number-buttons">
                        <button onClick={this.playerX}>X</button>
                        <button onClick={this.playerO}>O</button>
                        <button onClick={this.random}>RANDOM</button>
                    </div>
                </div>
            </div>
            

        )
    }
}

/*************************** APP COMPONENT ********************************* */

class App extends React.Component{
    state={
        gameStarted: false,
        players: '',
        player: '',
        singlePlayer: ''
    }

    setPlayers=(players)=>{
        
        // Passed into LoadScreen component
        // User selects how many players and which letter they want
        this.setState({players})
    }

    setLetter=(letter)=>{
        // Set singlePlayer to whichever letter the singlePlayer wants to be
        let singlePlayer = this.state.players === '1' ? (letter ? 'X':'O'): '';
        // Set the letter (true = 'X', false='O')
        // Start the game
        this.setState({player:letter, singlePlayer,gameStarted:true})
    }

    render(){
        /* Loads components LoadScreen -> SelectLetter -> Canvas
        * Canvas will pass in props based on responses from the first two components
        */
        if(this.state.gameStarted) return <Canvas player={this.state.player} players={this.state.players} singlePlayer={this.state.singlePlayer}/>;
        else if(this.state.players){return <SelectLetter setLetter={this.setLetter}/>}
        else { return <LoadScreen setPlayers={this.setPlayers} /> }
    }
}

/*************************** RENDER SCREEN ********************************** */
ReactDOM.render(
    <App />,
    document.getElementById('root')
)
