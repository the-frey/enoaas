function Eno() {
    var self = this;
    this.numericalSequences = [ [1,5,-4,6],
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

    this.key = "C";
    this.pitch = 3;

    this.drums = EDrums('x.x.x.x.');
    this.drums.amp = 0.75;

    this.bass = FM('bass')
       .note.seq( [0,0,0,7,14,13].rnd(), [1/8,1/16].rnd(1/16,2));

    this.keys = Synth( 'rhodes', {amp:.35} )
        .chord.seq( Rndi(0,6,3), 1 );
        //.fx.add( Delay() )

    Gibber.scale.root.seq( ['c4','ab3','bb3'], [4,2,2] );
    //Gibber.scale.mode.seq( ['Minor','Mixolydian'], [6,2] )

}

Eno.prototype.updateDOM = function(data) {
    console.log("do the thing");
};

Eno.prototype.setTempo = function(newTempo) {
    Clock.bpm = newTempo;
}

Eno.prototype.setChordSequence = function(number) {
    var self = this;
    var numerical = this.numericalSequences[number];
    var sequence = [];
    var roots = [];

    numerical.forEach(function(noteNumber) {
        var minor    = (noteNumber < 0);
        var ext      = Math.abs(noteNumber % 1);
        var rootNum  = Math.floor(Math.abs(noteNumber));

        var rootNote = self.scales[self.key][rootNum - 1]
        rootNote += (rootNote == "a" || rootNote == "b"
                     ? self.pitch - 1 : self.pitch).toString();
        roots.push(rootNote);

        var chord = rootNote +
                    (minor ? "m" : "") +
                    (ext > 0 ? ext.toString() : "");

        sequence.push(chord);
    });

    console.log(roots);
    console.log(sequence);

    // this monstrostity creates an array of 1s the length of the sequence
    changes = Array.apply(null, Array(numerical.length)).map(Number.prototype.valueOf, 1); // need to change this to be more interesting
    Gibber.scale.root.seq(roots, changes);
    this.keys.chord.seq(sequence, changes);
}

function setupGibber() {
  window.eno = new Eno();
};


