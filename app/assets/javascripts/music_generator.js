function Eno() {
    this.sequences = [[1,5,-4,6]];



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

Eno.prototype.updateDOM = function(data) {
    console.log("do the thing");
};



function setupGibber() {
  window.eno = new Eno();
};


