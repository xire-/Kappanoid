///////////////// IntroState
// __import__ gameStates-IntroState.js

///////////////// PlayingState
// __import__ gameStates-PlayingState.js

// states of the game
var states = {
    intro: new IntroState(),
    playing: new PlayingState()
};

// current state of main
var currState = states.intro;