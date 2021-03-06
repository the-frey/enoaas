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

    this.drumSequences = [{kick: 4, hat: 0, snare:0},
                          {kick: 4, hat: 1, snare:0},
                          {kick: 4, hat: 1, snare:2}];

    this.vars = window.getUserVars();
    console.log("starting vars");
    console.log(this.vars);

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

    this.bass = FM('bass', {amp:.5});
    this.lead = FM('stabs', {amp:.4, decay: 5000} );
    this.keys = Synth( 'bleep', {amp:.2, decay: 80000} );

    this.setContentLength(this.vars.contentLength);
    this.setSenderNumber(this.vars.sender);
    this.setChordSequence(this.vars.chordProgression);
    this.setSentiment(this.vars.sentiment);
    this.setTempo(this.vars.tempo);

    this.follow = Follow(this.kick)
}

Eno.prototype.updateVars = function(data){
    var chordSeq = Math.round(data.chord_progression);

    this.setTempo(data.tempo);
    this.setChordSequence(chordSeq);
    this.setSentiment(data.sentiment);
    this.setSenderNumber(data.sender);
    this.setContentLength(data.content_length);

    this.vars.tempo = data.tempo;
    this.vars.sentiment = data.sentiment;
    this.vars.contentLength = data.content_length;
    this.vars.chordProgression = chordSeq;
    this.vars.tempo = data.tempo;
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

    var senderdigits = this.vars.sender.substr(this.vars.sender.length - sequence.length,
                                                this.vars.sender.length);
    changes = senderdigits.split("").map(function(digit) {
                if (digit < 4) return (1/2);
                if (digit < 7) return (1);
                return 2;
    });

    Gibber.scale.root(self.key);
    //Gibber.scale.root.seq(roots, changes);
    this.keys.chord.seq(sequence, changes);
};

Eno.prototype.setSentiment = function(sentiment) {
    // set the mode
    Gibber.scale.mode = this.modes[Math.floor(sentiment * 7)];
    // tweak the keys
    var keysWaveform = "Saw";
    if(sentiment < 0.3) keysWaveform = "Noise";
    if(sentiment < 0.5) keysWaveform = "Square";
    else if(sentiment > 0.8) keysWaveform = "Sine";
    this.keys.waveform = keysWaveform;
    this.keys.amp = sentiment < 0.2 ? 0 : 0.3 * sentiment;

    // tweak the lead
    this.lead.fx.remove();
    if(sentiment < 0.5) {
        this.lead.fx.add(Crush({bitDepth:sentiment*16, sampleRate:sentiment}));
    }
    this.lead.decay(30000*sentiment);

    // tweak the bass
    this.bass.fx.remove();
    this.bass.fx.add(Distortion((1-sentiment) * 20))
}

Eno.prototype.setContentLength = function(length) {
    var maxLength = 80;
    if (length < maxLength/3) {
        this.setDrumSequence(0);
    }
    else if (length < 2*maxLength/3) {
        this.setDrumSequence(1);
    }
    else {
        this.setDrumSequence(2);
    }
}

Eno.prototype.setSenderNumber = function(number) {
    var numberAsIntArray = number.split("").map(function(x) { return parseInt(x); });
    this.bass.note.seq(numberAsIntArray.rnd(), [1/8,1/16].rnd(1/16,2));
    this.lead.note.seq(numberAsIntArray.map(function(x) { return x*2 + 7; }).rnd(), [1/16,1/8].rnd());
}

Eno.prototype.setDrumSequence = function(number) {
    var amps = this.drumSequences[number];
    this.kick.amp = amps.kick;
    this.hat.amp = amps.hat;
    this.snare.amp = amps.snare;
};

function setupGibber() {
  window.eno = new Eno();
}


