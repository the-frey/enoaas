function Eno() {
    this.sequences = [ [1,5,-4,6] ];

    this.drums = EDrums('x*o*x*o-');
    this.drums.amp = 0.75;

    this.bass = FM('bass')
        .note.seq( [0,0,0,7,14,13].rnd(), [1/8,1/16].rnd(1/16,2));

    this.keys = Synth( 'rhodes', {amp:.35} )
        .chord.seq( Rndi(0,6,3), 1 )
        .fx.add( Delay() )

    Gibber.scale.root.seq( ['c4','ab3','bb3'], [4,2,2] )
    Gibber.scale.mode.seq( ['Minor','Mixolydian'], [6,2] )

}

Eno.prototype.updateVars = function(data){
    this.setTempo(data.tempo);

    window.eno.vars.sentiment = data.sentiment;
    window.eno.vars.contentLength = data.content_length;
    window.eno.vars.chordProgression = data.chord_progression;
    window.eno.vars.tempo = data.tempo;
}

Eno.prototype.updateVis = function(data) {
    console.log('New data received!');
    console.log(data);
    var currentFlockSize = window.eno.flock.birds.length;
    var newFlockSize = Math.floor(data.tempo / 2);

    if (newFlockSize > currentFlockSize) {
        var numberOfBirdsToAdd = (newFlockSize - currentFlockSize);
        window.eno.flock.addNBirds(numberOfBirdsToAdd);
    } else {
        var numberOfBirdsToRemove = (currentFlockSize - newFlockSize);
        window.eno.flock.removeNBirds(numberOfBirdsToRemove);
    }

    this.updateVars(data)
    console.log('Data updated!');
};

Eno.prototype.setTempo = function(newTempo) {
    Clock.bpm = newTempo;
}

function setupGibber() {
  window.eno = new Eno();
};


