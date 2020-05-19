// Initiating global variables
var turnCount
var playerColorTurn
var oldDivId 
var newDivId
var middleTileX
var middleTileY
var mustJumpPieces
var hasAnotherJump

function startTheGame()
{   
    initPiecesArray()
    var divs = document.getElementsByTagName('div')
    for (var i=2; i < divs.length; i++)
        divs[i].innerHTML = ""

    for(var x = 0; x < 8; x++)
        for(var y = 0; y < 8; y++)
            if(piecesArray[x][y] != null)
                {
                    var img = document.createElement("img")
                    img.setAttribute("id", ""+x+y)
                    img.setAttribute("src", "img/"+piecesArray[x][y]+".jpg")
                    img.setAttribute("draggable", "true")
                    img.setAttribute("ondragstart", "drag(event)")
                    img.setAttribute("ondragend", "dragOver()")
                    img.setAttribute("width", "38")
                    img.setAttribute("height", "38")
                    document.getElementById("tile"+x+y).appendChild(img)
                }
    print("Red player, lets play!")
    boardDisplay(true)
    document.getElementById("draw").style.display = "inline"    
    document.getElementById("resign").style.display = "inline"  
    turnCount = 0
    playerColorTurn = "r"
    mustJumpPieces = []
}
// Display/hide all tiles - pieces
function boardDisplay(display)
{
    if(display)
        choise = "inline"
    else 
        choise = "none"
    var tiles = document.getElementsByClassName('tiles')
    for (var i = 0; i < tiles.length; i ++) 
        tiles[i].style.display = choise
}
// Resign function
function playerResign()
{
    print((playerColorTurn=='r'?"Red":"Black") + " player has resigned!")
    boardDisplay(false)
    clearButtons(4)
}
// Draw function
function askADraw(action)
{
    if(action == 1){
        print((playerColorTurn=='r'?"Red":"Black") + " player has asked for a draw, <br> Please Accept or Reject")
        document.getElementById("accept").style.display = "inline"
        document.getElementById("reject").style.display = "inline"
    }
    if(action == 2){
        print((playerColorTurn=='b'?"Red":"Black") + " player has accepted, the game ended by draw!")
        boardDisplay(false)
        clearButtons(4)
    }
    if(action == 3){
        print((playerColorTurn=='b'?"Red":"Black") + " player has rejected, the game continues! <br> Please complete your move...")
        clearButtons(2)
    }
}
// Hiding inactive buttons
function clearButtons(buttons)
{
    document.getElementById("accept").style.display = "none" 
    document.getElementById("reject").style.display = "none" 
    if(buttons>2){
        document.getElementById("resign").style.display = "none" 
        document.getElementById("draw").style.display = "none"} 
}
// Prevent pieces movement
function stopPieces(){
    var imgs = document.getElementsByTagName('img')
    for (var i=0; i < imgs.length; i++)
    {   
        imgs[i].setAttribute("draggable", "false")
    }
}
// Initiating pieces array
var piecesArray
function initPiecesArray(){
piecesArray = [
    ["b", null, "b", null, "b", null, "b", null],
    [null, "b", null, "b", null, "b", null, "b"],
    ["b", null, "b", null, "b", null, "b", null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, "r", null, "r", null, "r", null, "r"],
    ["r", null, "r", null, "r", null, "r", null],
    [null, "r", null, "r", null, "r", null, "r"]
]}
// End of current turn
function endTurn()
{
    hasJumped = false
    turnCount++
    (turnCount%2==0)?playerColorTurn = "r":playerColorTurn = "b"
    var piecesCounter = 0
    for(var x=0; x<8; x++)
        for(var y=0; y<8; y++)
            if(piecesArray[x][y]!=null)
                if(piecesArray[x][y][0]==playerColorTurn)
                    piecesCounter++

    if(piecesCounter== 0)
    {
        print((playerColorTurn=='b'?"Red":"Black") + " player has won the game!")
        clearButtons(4)
        stopPieces()
        return
    }
    if(checkIfSomePieceMovable()){
        print((playerColorTurn=='r'?"Red":"Black")+" player turn")
    }else {
        print("The game ended by a draw")
        clearButtons(4)
        stopPieces()
    }
}

// Checking tile between two tiles
function findMiddleTile(oldId, newId)
{
    middleTileX = oldId[4]-((oldId[4]-newId[4])/2)
    middleTileY = oldId[5]-((oldId[5]-newId[5])/2)
}
// Removing a piece from the old location
function removePiece(divId)
{ 
    document.getElementById(divId).innerHTML = ''
    piecesArray[divId[4]][divId[5]] = null
}

//Checking if the piece becoming a king
function checkIfBecameKing()
{
    if(piecesArray[oldDivId[4]][oldDivId[5]].length < 2)
    {
        if(newDivId[4] == 0)
            if(piecesArray[oldDivId[4]][oldDivId[5]] == 'r')
                return true
        if(newDivId[4] == 7)
            if(piecesArray[oldDivId[4]][oldDivId[5]] == 'b')
                return true
    }
    return false
}
// Just a print function
function print(msg)
{
    if(msg.length==0)
        msg = (playerColorTurn=='r'?"Red":"Black")+" player turn"
    document.getElementById('status').innerHTML = msg
}
// On drag over effects
function dragOver(){
    document.getElementById(oldDivId).style.opacity = "1"
    clearMarks("green")
}
// Function to allow drop
function allowDrop(event) {
    event.preventDefault()
}
var holdingPiece // Drag validating var
// Drag piece function
function drag(event) {
    oldDivId = "tile" + event.target.id
    if(playerColorTurn == piecesArray[oldDivId[4]][oldDivId[5]][0]){
        if(((checkPieceMovable(oldDivId))>0)&&((mustJumpPieces.length==0)||(mustJumpPieces.includes(oldDivId)))){
            event.dataTransfer.setData("text", event.target.id)
            document.getElementById(oldDivId).style.opacity = "0"
            markPossibleMoves(oldDivId)
            holdingPiece = true

        }else print("Cannot move that piece!")
    }else print("Cannot move opponent's piece!")
}

function clearMarks(markColor){
    var divs = document.getElementsByTagName("div")
    for(i=2; i<divs.length; i++){
        if(divs[i].style.border == "4px solid "+markColor){
        divs[i].style.border = "none"
        divs[i].style.margin = "0px"
        }
    }
}
//Marks possible moves on drag
function markPossibleMoves(oldDivId)
{
    var divs = document.getElementsByTagName("div")
    for(i=2; i<divs.length; i++){
        var moveType = checkIfValidMove(oldDivId,divs[i].id)
        if(((moveType == 1)&&(mustJumpPieces.length==0))||(moveType==2)){
            divs[i].style.border = "4px solid green"
            divs[i].style.margin = "-4px"
        }
    }
}
function test()
{

    var divs = document.getElementsByTagName("div")
    for (var i=2; i < divs.length; i++){
        //document.getElementById(divs[i].id).style.border = "4px solid green"
        //document.getElementById(divs[i].id).style.margin = "-4px"
        divs[i].style.border = "4px solid green"
        divs[i].style.margin = "-4px"
    }
    
}

// Drop piece function
function drop(event) 
{
    if(holdingPiece)
    {
        newDivId = event.target.id
        if(newDivId.length>2)
        {
            if(validateMove(event)==true)
            {
                removePiece(oldDivId)
                
                if(!hasAnotherJump)
                {
                    endTurn()
                }
            }else print("Cannot place here!")
        }
    }
    holdingPiece = false
}

// Assigning a piece at the new location
function assignPiece(event)
{
    var crowned
    var color = piecesArray[oldDivId[4]][oldDivId[5]]

    event.preventDefault()
    var pieceId = event.dataTransfer.getData("text") // img id
    event.target.appendChild(document.getElementById(pieceId))
    document.getElementById(pieceId).setAttribute("id", ""+newDivId[4]+newDivId[5])

    if(checkIfBecameKing() == true)
    {
        color = color + 'k'
        crowned = true
        document.getElementById(""+newDivId[4]+newDivId[5]).setAttribute("src", "img/"+color+".jpg")
    }

    piecesArray[newDivId[4]][newDivId[5]] = color
    return crowned
}
// Executing a move if is valid
function validateMove()
{
    
    var moveType = checkIfValidMove(oldDivId, newDivId)
    if (moveType<2 && mustJumpPieces.includes(oldDivId))
        return false
    if(moveType > 0)
    {
        clearMarks("blue")
        hasAnotherJump = false
        if(moveType == 2) // If the piece is jumping
        {
            removePiece('tile'+middleTileX+middleTileY) //Capture a piece
            hasAnotherJump = true
        }
        
        if(assignPiece(event)) 
            hasAnotherJump = false //End turn if became king
           
        if(hasAnotherJump){
            if(checkPieceMovable(newDivId) == 2){ //Check if another jump in the same turn is possible
                mustJumpPieces.push(newDivId)
                print("Another jump is mandatory")
                hasAnotherJump = true
            }else hasAnotherJump = false
        }

        return true
    }
    return false
}
function markJumper(divId){
    document.getElementById(divId).style.border = "4px solid blue"
    document.getElementById(divId).style.margin = "-4px"
}
// Checking that a piece is able to move or jump
function checkPieceMovable(divId)
{
    var tempNewDivId
    var moveType = 0
    var result
        var divs = document.getElementsByTagName('div')
        for (var i=2; i < divs.length; i++)
        {   
            tempNewDivId = divs[i].getAttribute('id')
            if((result = checkIfValidMove(divId, tempNewDivId)) > moveType)
                moveType = result
        }
        if(moveType==2)
            markJumper(divId)
    return moveType
}
// Checking if the move is valid
function checkIfValidMove(oldId, newId)
{   
    var notValidMove = 0
    var isValidMove = 1
    var isValidJump = 2

    var newCoordX = newId[4]
    var newCoordY = newId[5]
    var oldCoordX = oldId[4]
    var oldCoordY = oldId[5]


    if(piecesArray[newCoordX][newCoordY] == null)
    {
        //Jump function checking
        if((Math.abs(oldCoordX-newCoordX) == 2 ) && (Math.abs(oldCoordY-newCoordY) == 2))
        {   
            findMiddleTile(oldId, newId)
            if((piecesArray[middleTileX][middleTileY] == (playerColorTurn == "r"?"b":"r")) || (piecesArray[middleTileX][middleTileY] == (playerColorTurn == "r"?"b":"r") + "k")) //If opposite piece
            {
                if((piecesArray[oldCoordX][oldCoordY].length == 2) || (hasAnotherJump))
                    return isValidJump
                if((piecesArray[oldCoordX][oldCoordY] == "r")&&(oldCoordX - newCoordX == 2))
                    return isValidJump
                if((piecesArray[oldCoordX][oldCoordY] == "b")&&(newCoordX - oldCoordX == 2))
                    return isValidJump
            }
        }
        
        //Regular move checking
        if((Math.abs(oldCoordX-newCoordX) == 1 ) && (Math.abs(oldCoordY-newCoordY) == 1))
        { 
            //If piece is king
            if(piecesArray[oldCoordX][oldCoordY].length == 2)
                    return isValidMove
            //If piece is regular piece
            if(piecesArray[oldCoordX][oldCoordY].length == 1)
            {
                if((piecesArray[oldCoordX][oldCoordY] == "r")&&(oldCoordX - newCoordX == 1))
                        return isValidMove
                
                if((piecesArray[oldCoordX][oldCoordY] == "b")&&(newCoordX - oldCoordX == 1))
                        return isValidMove
            }
        }
    }
    return notValidMove
}
// Checking if any player's piece is movable and collects jumpers
function checkIfSomePieceMovable()
{
    var tempOldDivId
    mustJumpPieces = []
    var result = 0
    var isMovable = false
    var divs = document.getElementsByTagName('div')
    for (var i=2; i < divs.length; i++)
    {   
        tempOldDivId = divs[i].getAttribute('id')
        if(piecesArray[tempOldDivId[4]][tempOldDivId[5]] != null){
            if(piecesArray[tempOldDivId[4]][tempOldDivId[5]][0] == playerColorTurn)
            {
                result = checkPieceMovable(tempOldDivId)
                if(result>0)
                    isMovable = true
                if(result==2){
                    mustJumpPieces.push(tempOldDivId) 
                }
            }
        }
    }
    return isMovable
}
