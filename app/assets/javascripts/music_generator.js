function Eno() {
    var self = this;
    this.numericalChordSeqs = [ [1,5,-4,6],
                                [1,5,-6,-3],
                                [-4,5,4,5],
                                [1,-6,4,5],
                                [1,4,-6,5],
                                [1,4],
                                [1,4,5,1],
                                [1,4,1,5,1],
                                [-2,5,1],
                                [1,-6,-2,5]
    ];

    this.scales = { C:["c","d","e","f","g","a","b"],
                    G:["g","a","b","c","d","e","fs"]
    };

    this.drumSequences = [{kick: 0.75, hat: 0, snare:0},
                          {kick: 0.75, hat: 0.5, snare:0},
                          {kick: 0.75, hat: 0.5, snare:0.5}];

    this.vars = window.getUserVars();

    // ranked roughly in order of sentiment
    this.modes = ['Aeolian', 'Locrian', 'Phrygian', 'Mixolydian', 'Dorian', 'Lydian', 'Ionian'];

    this.key = "C";
    this.pitch = 4;

    this.kick = EDrums('x.x.x.x.');
    this.kick.amp = 0.75;
    this.hat = EDrums('*******-');
    this.hat.amp = 0;
    this.snare = EDrums('..o...o.');
    this.snare.amp = 0;

    //this.bass = Mono('bass').note.seq([0,0,0,0,4].rnd(), 1/8);

    this.keys = Synth( 'rhodes', {amp:.5} );
    this.setChordSequence(0);
    this.setDrumSequence(0);
    //this.lead = Mono('easy').note.seq([0,7,7,5,7,1,1,5,6,6,6].rnd(), [1/8,1/4].rnd());
    this.setSentiment(0.5);
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
    this.updateVars(data)
    console.log('Data updated!');

    var currentFlockSize = window.eno.flock.birds.length;
    var newFlockSize = Math.floor(data.tempo / 2);

    if (newFlockSize > currentFlockSize) {
        var numberOfBirdsToAdd = (newFlockSize - currentFlockSize);
        window.eno.flock.addNBirds(numberOfBirdsToAdd);
    } else {
        var numberOfBirdsToRemove = (currentFlockSize - newFlockSize);
        window.eno.flock.removeNBirds(numberOfBirdsToRemove);
    }
};

Eno.prototype.setTempo = function(newTempo) {
    Clock.bpm = newTempo;
}

Eno.prototype.setChordSequence = function(number) {
    var self = this;
    var numerical = this.numericalChordSeqs[number];
    var sequence = [];
    var roots = [];

    numerical.forEach(function(noteNumber) {
        var minor    = (noteNumber < 0);
        var ext      = Math.abs(noteNumber % 1);
        var rootNum  = Math.floor(Math.abs(noteNumber));

        var rootNote = self.scales[self.key][rootNum - 1]
        rootNote += self.pitch.toString();
        roots.push(rootNote);

        var chord = rootNote +
                    (minor ? "m" : "") +
                    (ext > 0 ? ext.toString() : "");

        sequence.push(chord);
    });

    console.log(roots);
    console.log(sequence);

    // this monstrostity creates an array of 1s the length of the sequence
    //changes = Array.apply(null, Array(numerical.length)).map(Number.prototype.valueOf, 1); // need to change this to be more interesting
    changes = [];
    for(i=0; i<sequence.length; i++) {
        changes.push([1/4,1/2,1][Math.floor(random() * 4)]);
    }
    console.log(changes);


    Gibber.scale.root.seq(roots, changes);
    this.keys.chord.seq(sequence, changes);
};

Eno.prototype.setSentiment = function(number) {
    // set the mode
    Gibber.scale.mode = this.modes[Math.floor(number * 7)];
    // tweak the lead

    // tweak the bass
}

Eno.prototype.setDrumSequence = function(number) {
    amps = this.drumSequences[number];
    this.kick.amp = amps.kick;
    this.hat.amp = amps.hat;
    this.snare.amp = amps.snare;
};

function setupGibber() {
  window.eno = new Eno();
}


